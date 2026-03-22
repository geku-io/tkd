"use client";
import React, { useEffect, useRef } from "react";
import MainBlock from "../MainBlock";
import {
   CompetitionType,
   newCompetitionSchema,
} from "./new-competition.schema";
import { defaultCompetition } from "./new-competition.constants";
import { v4 as uuidv4 } from "uuid";
import { useCreateEntities } from "../../../../hooks/query";
import { API } from "../../../../constants/api";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { useAppForm } from "../../../../contexts/AdminFormContext";
import { FieldGroup } from "../../../UI/lib-components/field";
import Cross from "../../../UI/Cross";
import AddFieldButton from "../../../UI/form/AddFieldButton";

const NewCompetitionPage = () => {
   const firstInputRef = useRef<HTMLInputElement | null>(null);
   const mutation = useCreateEntities<CompetitionType>({
      source: API.COMPETITIONS,
      queryKey: QUERY_KEYS.TOURNAMENTS,
   });
   const form = useAppForm({
      defaultValues: defaultCompetition,
      onSubmit: ({ value }) => {
         mutation.mutate(value);
      },
      validators: {
         onChange: newCompetitionSchema,
         onBlur: newCompetitionSchema,
      },
   });
   useEffect(() => {
      firstInputRef.current?.focus();
   }, []);
   return (
      <MainBlock title="Создание нового соревнования">
         <div className="md:flex md:justify-between md:gap-x-[8%] w-full">
            <form
               onSubmit={e => {
                  e.preventDefault();
                  e.stopPropagation();
               }}
               className="w-full"
            >
               <FieldGroup className="flex flex-col sm:gap-y-10 gap-y-6">
                  <form.AppField name="tournamentTitle">
                     {field => {
                        return (
                           <div className="border sm:p-8 p-4 rounded-lg border-border-gray shadow-border">
                              <field.SelectField
                                 ref={firstInputRef}
                                 isMulti={false}
                                 label="Название соревнования *"
                                 source={API.TOURNAMENTS}
                                 queryKey={QUERY_KEYS.TOURNAMENTS}
                              />
                           </div>
                        );
                     }}
                  </form.AppField>
                  <form.Field name="arenas" mode="array">
                     {fieldArr => (
                        <div className="flex flex-col sm:gap-y-10 gap-y-6">
                           {fieldArr.state.value.map((val, index) => (
                              <div
                                 key={val.id}
                                 className="relative flex flex-col sm:py-8 py-4 rounded-lg border-border-gray shadow-border"
                              >
                                 {fieldArr.state.value.length > 1 && (
                                    <Cross
                                       className="absolute top-3 right-3"
                                       clickHandler={() => {
                                          fieldArr.removeValue(index);
                                       }}
                                    />
                                 )}
                                 <form.AppField
                                    name={`arenas[${index}].arenaTitle`}
                                 >
                                    {field => (
                                       <div className="sm:px-8 px-4 sm:pb-8 pb-4 border-b border-border">
                                          <field.SelectField
                                             isMulti={false}
                                             label="Название арены *"
                                             source={API.ARENAS}
                                             queryKey={QUERY_KEYS.ARENAS}
                                          />
                                       </div>
                                    )}
                                 </form.AppField>
                                 <form.Field
                                    name={`arenas[${index}].info`}
                                    mode="array"
                                 >
                                    {subFieldArr => (
                                       <div className="sm:mb-4 mb-2">
                                          <div className="mb-6">
                                             {(
                                                subFieldArr.state.value ?? []
                                             ).map((subVal, subIndex) => (
                                                <div
                                                   className="relative flex flex-col gap-y-6 sm:p-8 p-4 last:pb-0 last:border-none border-b border-border"
                                                   key={subVal.id}
                                                >
                                                   {subFieldArr.state.value
                                                      .length > 1 && (
                                                      <Cross
                                                         className="absolute top-3 right-3"
                                                         clickHandler={() => {
                                                            subFieldArr.removeValue(
                                                               subIndex
                                                            );
                                                         }}
                                                      />
                                                   )}
                                                   <form.AppField
                                                      name={`arenas[${index}].info[${subIndex}].discipline`}
                                                   >
                                                      {disciplineField => (
                                                         <disciplineField.SelectField
                                                            source={
                                                               API.DISCIPLINES
                                                            }
                                                            queryKey={
                                                               QUERY_KEYS.DISCIPLINES
                                                            }
                                                            label="Название дисциплины"
                                                            isMulti={false}
                                                         />
                                                      )}
                                                   </form.AppField>
                                                   <form.Subscribe
                                                      selector={state =>
                                                         state.values.arenas[
                                                            index
                                                         ].info[subIndex]
                                                            .categories
                                                      }
                                                   >
                                                      {() => (
                                                         <form.AppField
                                                            name={`arenas[${index}].info[${subIndex}].categories`}
                                                            mode="array"
                                                         >
                                                            {categoriesField => (
                                                               <categoriesField.SelectField
                                                                  source={
                                                                     API.CATEGORIES
                                                                  }
                                                                  queryKey={
                                                                     QUERY_KEYS.CATEGORIES
                                                                  }
                                                                  label="Название категорий"
                                                               />
                                                            )}
                                                         </form.AppField>
                                                      )}
                                                   </form.Subscribe>
                                                </div>
                                             ))}
                                          </div>
                                          <AddFieldButton
                                             text="Добавить дисциплину"
                                             clickHandler={() =>
                                                subFieldArr.pushValue({
                                                   id: uuidv4(),
                                                   discipline: "",
                                                   categories: [],
                                                })
                                             }
                                          />
                                       </div>
                                    )}
                                 </form.Field>
                              </div>
                           ))}
                           <AddFieldButton
                              text="Добавить арену"
                              clickHandler={() =>
                                 fieldArr.pushValue({
                                    arenaTitle: "",
                                    id: uuidv4(),
                                    info: [
                                       {
                                          id: uuidv4(),
                                          discipline: "",
                                          categories: [],
                                       },
                                    ],
                                 })
                              }
                           />
                        </div>
                     )}
                  </form.Field>
               </FieldGroup>
            </form>
            <div className="md:basis-[20%] max-md:mt-8">
               <form.AppForm>
                  <form.SubmitButton className="w-full" />
               </form.AppForm>
            </div>
         </div>
      </MainBlock>
   );
};

export default NewCompetitionPage;
