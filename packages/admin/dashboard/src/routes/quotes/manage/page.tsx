export { QuoteManage as Component } from "./page";

import { useParams, useNavigate } from "react-router-dom";
import { useQuote } from "../../../hooks/quotes";
import { Container, Heading, Toaster } from "@medusajs/ui";
import { ManageQuoteForm } from "../../../components/quote/manage-quote-form";

export const QuoteManage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    return <div>Error: Invalid Quote ID</div>;
  }

  const { quote, isLoading } = useQuote(id, {
    fields: "*draft_order.customer",
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!quote) {
    return <div>Error: Quote not found</div>;
  }

  return (
    <>
      <Container className="divide-y p-0">
        <Heading className="flex items-center justify-between px-6 py-4">
          Manage Quote
        </Heading>
        <ManageQuoteForm order={quote.draft_order} quote={quote} />
      </Container>
      <Toaster />
    </>
  );
};
