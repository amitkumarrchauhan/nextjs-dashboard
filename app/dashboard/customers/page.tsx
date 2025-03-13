import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

const CustomersPage = () => {
  console.log('CustomersPage.render');

  return (
    <div>
      <p>Customers Page</p>
    </div>
  );
};

export default CustomersPage;
