import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./pages/home";

const client = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={client}>
      <Home />
    </QueryClientProvider>
  );
};

export default App;
