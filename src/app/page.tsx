// sections
import { HomeView } from 'src/sections/home/view';
import ClassicLoginPage from './auth-demo/classic/login/page';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Minimal: The starting point for your next project',
};

export default function HomePage() {
  return <ClassicLoginPage />;
}
