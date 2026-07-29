import { FeeStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

function toInvoiceDTO(inv: {
  id: string;
  term: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: FeeStatus;
  studentId: string;
}) {
  return {
    id: inv.id,
    studentId: inv.studentId,
    term: inv.term,
    description: inv.description,
    amount: inv.amount,
    dueDate: inv.dueDate.toISOString().split('T')[0],
    status: inv.status.toLowerCase() as 'paid' | 'pending' | 'overdue',
  };
}

export async function listInvoicesForStudent(studentId: string) {
  const invoices = await prisma.feeInvoice.findMany({
    where: { studentId },
    orderBy: { dueDate: 'asc' },
  });
  return invoices.map(toInvoiceDTO);
}

export async function createInvoice(input: {
  studentId: string;
  term: string;
  description?: string;
  amount: number;
  dueDate: string;
}) {
  const student = await prisma.studentProfile.findUnique({ where: { id: input.studentId } });
  if (!student) throw AppError.notFound('Student not found.');

  const invoice = await prisma.feeInvoice.create({
    data: {
      studentId: input.studentId,
      term: input.term,
      description: input.description ?? 'Tuition & Transport',
      amount: input.amount,
      dueDate: new Date(input.dueDate),
      status: FeeStatus.PENDING,
    },
  });

  await recomputeStudentFeeStatus(input.studentId);
  return toInvoiceDTO(invoice);
}

async function recomputeStudentFeeStatus(studentId: string) {
  const pending = await prisma.feeInvoice.findMany({
    where: { studentId, status: { in: [FeeStatus.PENDING, FeeStatus.OVERDUE] } },
  });
  const pendingAmount = pending.reduce((sum, i) => sum + i.amount, 0);
  const hasOverdue = pending.some((i) => i.dueDate < new Date());

  await prisma.studentProfile.update({
    where: { id: studentId },
    data: {
      pendingFeeAmount: pendingAmount,
      feeStatus: pendingAmount === 0 ? FeeStatus.PAID : hasOverdue ? FeeStatus.OVERDUE : FeeStatus.PENDING,
    },
  });
}

/**
 * Pays down a student's oldest outstanding invoices first (FIFO), up to
 * the given amount — mirrors the frontend's single "Pay $X Now" button,
 * which pays off the displayed pending balance in one action.
 */
export async function payFees(payerUserId: string, studentId: string, amount: number, method: string) {
  const outstanding = await prisma.feeInvoice.findMany({
    where: { studentId, status: { in: [FeeStatus.PENDING, FeeStatus.OVERDUE] } },
    orderBy: { dueDate: 'asc' },
  });

  if (!outstanding.length) throw AppError.badRequest('No outstanding fees for this student.');

  let remaining = amount;
  const payments = [];

  for (const invoice of outstanding) {
    if (remaining <= 0) break;
    if (remaining >= invoice.amount) {
      await prisma.feeInvoice.update({ where: { id: invoice.id }, data: { status: FeeStatus.PAID } });
      const payment = await prisma.feePayment.create({
        data: { invoiceId: invoice.id, amount: invoice.amount, payerUserId, method },
      });
      payments.push(payment);
      remaining -= invoice.amount;
    }
  }

  await recomputeStudentFeeStatus(studentId);

  const student = await prisma.studentProfile.findUniqueOrThrow({ where: { id: studentId } });
  return {
    paymentsCreated: payments.length,
    totalPaid: amount - remaining,
    remainingBalance: student.pendingFeeAmount,
    feeStatus: student.feeStatus.toLowerCase(),
  };
}
