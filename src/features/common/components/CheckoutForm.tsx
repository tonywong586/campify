import React, { useState } from "react";
import { Button, Modal, ModalProps, Stack } from "@mantine/core";
import {
  AddressElement,
  CardElement,
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { trpc } from "~/utils/trpc";
import Stripe from "stripe";
import { useSession } from "next-auth/react";

interface BaseProps {
  paymentIntent?: Stripe.PaymentIntent;
  orderId?: string;
}

interface StrapiCheckoutModalProps
  extends Omit<ModalProps, "children">,
    BaseProps {
  onClose: () => void;
}

export const CheckoutForm = ({ paymentIntent }: BaseProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const processPayment = trpc.cart.processPayment.useMutation();
  const { data: session } = useSession();
  const [disabled, setDisabled] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements || !paymentIntent) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: `${session?.user?.firstName} ${session?.user?.lastName}`,
        email: session?.user?.email,
      },
    });

    if (error) {
      console.error("Failed to create payment method:", error);
      return;
    }

    console.log("paymentIntent", paymentIntent);
    // Call your backend to process the payment
    const res = await processPayment.mutateAsync({
      paymentMethodId: paymentMethod.id,
      paymentIntentId: paymentIntent.id, // Add this line
    });

    console.log(res);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <CardElement
          onChange={(e) => {
            console.log(e);
            if (e.error || !e.complete) {
              setDisabled(true);
            } else {
              setDisabled(false);
            }
          }}
        />
        <Button disabled={disabled} type="submit">
          Pay
        </Button>
      </Stack>
    </form>
  );
};
