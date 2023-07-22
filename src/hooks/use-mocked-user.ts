// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const user = {
    id: '8',
    createdAt: '2023-06-30T13:48:06.548305Z',
    modifiedAt: '2023-07-08T07:40:04.901066Z',
    version: 1,
    name: 'Apple Inc.',
    address: 'Silicon Valey',
    website: null,
    taxNumber: '12344',
    email: 'ataile.assvn@gmail.com',
    logo: null,
    invoiceReceivedEmail: 'tnghia@business.com',
    engName: null,
    digitalSignatureDueDate: null,
    digitalSignaturePeriod: null,
    digitalSignatureRegisDate: null,
    representPersonName: null,
    declarationPeriod: null,
    needAudit: null,
    businessTypeId: null,
    domainBusinessId: null,
  };

  return { user };
}
