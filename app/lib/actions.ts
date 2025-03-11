'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { z } from 'zod';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const CreateInvoiceFormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = CreateInvoiceFormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  console.log('actions.createInvoice ===> ');
  const rawFormData = {} as any;
  const entries = formData.entries();

  for (const keyValues of entries) {
    const key = keyValues[0];

    if (key.includes('$ACTION_ID')) continue;

    rawFormData[key] = keyValues[1];
  }

  // Test it out:
  console.log('rawFormData ===> ', rawFormData);
  console.log('typeof rawFormData.amount => ', typeof rawFormData.amount);
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
