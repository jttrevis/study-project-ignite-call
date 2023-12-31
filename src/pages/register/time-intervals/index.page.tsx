import React from "react";
import { Container, Header } from "../styles";
import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from "@ignite-ui/react";
import {
  FormError,
  IntervalBox,
  IntervalContainer,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
} from "./styles";
import { ArrowRight } from "phosphor-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { getWeekDays } from "@/utils/get-week-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertTimeStringToMinutes } from "@/utils/convert-time-string-to-minutes";
import { api } from "@/lib/axios";
import { useRouter } from "next/router";


const timeIntervalsFormSchema = z.object({
  intervals: z.array(z.object({
    weekDay: z.number().min(0).max(6),
    enable: z.boolean(),
    startTime: z.string(),
    endTime: z.string()
  }),
  
  ).length(7)
  .transform(intervals => intervals.filter(interval => interval.enable))
  .refine(intervals => intervals.length > 0, {
    message: 'Select at least one day of the week'
  })
  .transform(intervals => {
    return intervals.map(interval => {
      return {

        weekDay: interval.weekDay,
        startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
        endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
      }
    })
  })
  .refine(intervals => {
    return intervals.every(interval => interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,)
  }, {
    message: 'Minimum schedule time is 1 hour'
  })
})

type TimeIntervalFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
  const {register, control, handleSubmit, watch, formState: {isSubmitting, errors}} = useForm<TimeIntervalFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enable: false, startTime: '08:00', endTime: '18:00'},
        { weekDay: 1, enable: true, startTime: '08:00', endTime: '18:00'},
        { weekDay: 2, enable: true, startTime: '08:00', endTime: '18:00'},
        { weekDay: 3, enable: true, startTime: '08:00', endTime: '18:00'},
        { weekDay: 4, enable: true, startTime: '08:00', endTime: '18:00'},
        { weekDay: 5, enable: true, startTime: '08:00', endTime: '18:00'},
        { weekDay: 6, enable: false, startTime: '08:00', endTime: '18:00'},
      ]
    }
  })

  const weekDays = getWeekDays()

  const router = useRouter()
  const {fields} = useFieldArray({
    control,
    name: 'intervals',
  })

  const intervals = watch('intervals')

  async function handleSetTimeIntervals(data : any) {
    const {intervals} = data as TimeIntervalsFormOutput
    await api.post('/users/time-intervals', {intervals})  

    await router.push('users/update-profile')
  }



  return (
    <Container>
      <Header>
        <Heading as={"strong"}>Quase lá</Heading>

        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </Text>

        <MultiStep size={4} currentStep={3} />
      </Header>

      <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <IntervalContainer>
          {fields.map((field, index) => {
            return (
            <IntervalItem key={field.id}>
              <IntervalDay>
                <Controller name={`intervals.${index}.enable`}  control={control} render={({field}) => {
                  return (
                    <Checkbox onCheckedChange={(checked) => {
                      field.onChange(checked === true)
                    }} 
                    checked={field.value}
                    
                    />
                  )
                }}/>
                <Text>{weekDays[field.weekDay]}</Text>
              </IntervalDay>
              <IntervalInputs>
                <TextInput size="sm" type="time" step={60} {...register(`intervals.${index}.startTime`)}
                disabled={intervals[index].enable === false} 
                />
  
                <TextInput size="sm" type="time" step={60}  {...register(`intervals.${index}.endTime`)} disabled={intervals[index].enable === false} />
              </IntervalInputs>
            </IntervalItem>
            )
          })}



        </IntervalContainer>

        {errors.intervals && (
          <FormError>{errors.intervals.message}</FormError>
        )}

        <Button 
          disabled={isSubmitting} 
          type="submit"
        >
          Proximo Passo 
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  );
}
