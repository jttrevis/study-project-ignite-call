import React from "react";
import { Form, FromAnnotations } from "./styles";
import { Button, Text, TextInput } from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

const claimUserNameFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "O Usuario precisa ter no minimo 3 caracteres",
    })
    .regex(/^([a-z\\-]+)$/i, {
      message: "O usuario pode ter apenas letras e hifens",
    })
    .transform((username) => username.toLowerCase()),
});

type ClaimUserNameFormData = z.infer<typeof claimUserNameFormSchema>;

export const ClaimUserNameForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting},
  } = useForm<ClaimUserNameFormData>({
    resolver: zodResolver(claimUserNameFormSchema),
  })

  const router = useRouter()

  const handleClaimUserName = async (data: ClaimUserNameFormData) => {
    const { username } = data

    await router.push(`/register?username=${username}`)
  };
  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUserName)}>
        <TextInput
          size={"sm"}
          prefix={"ignite.com/"}
          placeholder={"seu-usuario"}
          {...register("username")}
        />
        <Button size={"sm"} type={"submit"} disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <FromAnnotations>
        <Text size={"sm"}>
          {errors.username
            ? errors.username.message
            : "Digite o nome do usuario"}
        </Text>
      </FromAnnotations>
    </>
  );
};
