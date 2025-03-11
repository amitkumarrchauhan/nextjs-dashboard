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
  const rawFormData = {} as any;
  const entries = formData.entries();

  for (const keyValues of entries) {
    const key = keyValues[0];

    if (key.includes('$ACTION_ID')) continue;

    rawFormData[key] = keyValues[1];
  }

  return rawFormData;
};

export async function createInvoice(formData: FormData) {
  console.log('actions.createInvoice ===> ');
  const rawFormData = getParsedFormData(formData);
  const { customerId, amount, status } = CreateInvoice.parse(rawFormData);
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = InvoiceFormSchema.omit({ id: true, date: true });

export const updateInvoice = async (invoiceId: string, formData: FormData) => {
  console.log('actions.updateInvoice ===> ', invoiceId, formData);
  //
  const rawFormData = getParsedFormData(formData);
  const { customerId, amount, status } = CreateInvoice.parse(rawFormData);
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    UPDATE invoices 
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${invoiceId}
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
};