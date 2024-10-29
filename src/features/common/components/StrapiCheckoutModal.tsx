import React, { useState } from "react";
import { Button, Modal, ModalProps, Paper, Stack, Text } from "@mantine/core";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { trpc } from "~/utils/trpc";
import Stripe from "stripe";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface BaseProps {
  paymentIntent?: Stripe.PaymentIntent;
  orderId?: string;
}

interface StrapiCheckoutModalProps
  extends Omit<ModalProps, "children">,
  BaseProps {
  onClose: () => void;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutForm = ({ paymentIntent }: BaseProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const stripe = useStripe();
  const elements = useElements();
  const { mutateAsync: processPayment } =
    trpc.cart.processPayment.useMutation();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsProcessingPayment(true);

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
      const res = await processPayment({
        paymentMethodId: paymentMethod.id,
        paymentIntentId: paymentIntent.id,
      });

      router.push("/profile?type=order");

      console.log(res);
    } catch (e) {
      console.log(e);
      setIsProcessingPayment(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Paper shadow="sm" p="md" radius="md">
          <CardElement
            onChange={(e) => {
              if (e.error || !e.complete) {
                setDisabled(true);
              } else {
                setDisabled(false);
              }
            }}
          />
        </Paper>

        {/* show price */}
        <Text size="xl" weight={700}>
          Total {paymentIntent!.amount / 100}{" "}
          {paymentIntent?.currency?.toUpperCase()}
        </Text>

        <Button disabled={disabled} type="submit" loading={isProcessingPayment}>
          Pay
        </Button>
      </Stack>
    </form>
  );
};

export function StrapiCheckoutModal({
  onClose,
  opened,
  paymentIntent,
}: StrapiCheckoutModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} centered title="Stripe Checkout">
      <Elements stripe={stripePromise}>
        <CheckoutForm paymentIntent={paymentIntent} />
      </Elements>
    </Modal>
  );
}
