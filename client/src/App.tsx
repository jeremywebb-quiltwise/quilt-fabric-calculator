import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Calculator from "@/pages/calculator";
import Studio from "@/pages/studio";
import Blog from "@/pages/blog";
import About from "@/pages/about";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/calculator" component={Calculator} />
      <Route path="/studio" component={Studio} />
      <Route path="/blog" component={Blog} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DndProvider backend={HTML5Backend}>
          <Toaster />
          <Router />
        </DndProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
