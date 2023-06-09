// sections
// import { HomeView } from 'src/sections/home/view';

// import { FirebaseLoginView } from 'src/sections/auth/firebase';
import ClassicLoginPage from './auth-demo/classic/login/page';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Accountant Solution System',
};

export default function HomePage() {
  return <ClassicLoginPage />;
}
