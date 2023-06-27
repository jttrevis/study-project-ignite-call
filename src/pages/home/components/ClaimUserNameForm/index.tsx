import React from "react";
import { Form, FromAnnotations } from "./styles";
import { Button, Text, TextInput } from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
    formState: { errors },
  } = useForm<ClaimUserNameFormData>({
    resolver: zodResolver(claimUserNameFormSchema),
  });

  const handleClaimUserName = async (data: ClaimUserNameFormData) => {
    console.log(data);
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
        <Button size={"sm"} type={"submit"}>
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
