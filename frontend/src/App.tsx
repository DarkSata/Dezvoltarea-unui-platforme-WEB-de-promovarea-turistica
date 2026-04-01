import "./App.css";
import AppRouter from "./app/router/AppRouter";
import { AxiosProvider } from "./providers/AxiosProvider";

export default function App() {
  return (
    <AxiosProvider>
      <AppRouter />
    </AxiosProvider>
  );
}
