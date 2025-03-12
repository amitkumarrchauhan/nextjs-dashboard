'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { z } from 'zod';
import { Invoice } from './definitions';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const InvoiceFormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = InvoiceFormSchema.omit({ id: true, date: true });

const getParsedFormData = (formData: FormData): Invoice => {
  const rawFormData: Partial<Invoice> = {};
  const entries = formData.entries();

  for (const keyValues of entries) {
    const key = keyValues[0] as keyof Invoice;

    if (key.includes('$ACTION_ID')) continue;

    // use never instead of any <--- eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawFormData[key] = keyValues[1] as never;
  }

  return rawFormData as Invoice;
};

export async function createInvoice(formData: FormData) {
  console.log('actions.createInvoice ===> ');

  // const x = 1;

  try {
    const rawFormData = getParsedFormData(formData);
    const { customerId, amount, status } = CreateInvoice.parse(rawFormData);
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch /* (error) */ {
    throw new Error('Failed to create invoice.');
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = InvoiceFormSchema.omit({ id: true, date: true });

export const updateInvoice = async (id: string, formData: FormData) => {
  console.log('actions.updateInvoice ===> ', id, formData);
  //
  const rawFormData = getParsedFormData(formData);
  const { customerId, amount, status } = UpdateInvoice.parse(rawFormData);
  const amountInCents = amount * 100;
  // const date = new Date().toISOString().split('T')[0];

  await sql`
    UPDATE invoices 
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
};

export const deleteInvoice = async (id: string, formData: FormData) => {
  console.log('actions.deleteInvoice ===> ', id, formData);

  // all error caught in the error.tsx
  // throw new Error('Failed to delete invoice.');

  await sql`
    DELETE FROM invoices
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/invoices');
};