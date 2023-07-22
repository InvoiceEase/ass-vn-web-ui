// @mui
import Grid from '@mui/material/Unstable_Grid2';
// types
import { IAddressItem } from 'src/types/address';
import { IPaymentCard } from 'src/types/payment';
import { IUserAccountBillingHistory } from 'src/types/profile';
//
import AccountBillingAddress from './account-billing-address';
import AccountBillingHistory from './account-billing-history';
import AccountBillingPayment from './account-billing-payment';
import AccountBillingPlan from './account-billing-plan';

// ----------------------------------------------------------------------

type Props = {
  plans: {
    subscription: string;
    price: number;
    primary: boolean;
  }[];
  cards: IPaymentCard[];
  invoices: IUserAccountBillingHistory[];
  addressBook: IAddressItem[];
};

export default function AccountBilling({ cards, plans, invoices, addressBook }: Props) {
  return (
    <Grid container spacing={5} disableEqualOverflow>
      <Grid xs={12} md={8}>
        <AccountBillingPlan plans={plans} cardList={cards} addressBook={addressBook} />

        <AccountBillingPayment cards={cards} />

        <AccountBillingAddress addressBook={addressBook} />
      </Grid>

      <Grid xs={12} md={4}>
        <AccountBillingHistory invoices={invoices} />
      </Grid>
    </Grid>
  );
}
