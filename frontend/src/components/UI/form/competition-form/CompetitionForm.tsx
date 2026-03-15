import React from "react";
import { withForm } from "@/contexts/AdminFormContext";
import { defaultCreationCompData } from "./competition-form.contstants";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { API } from "@/constants/api";
import { Skeleton } from "../../lib-components/skeleton";

interface IProps {
   isPending?: boolean;
}

const CompetitionForm = withForm({
   defaultValues: defaultCreationCompData,
   props: {
      isPending: false,
   } as IProps,
   render: function Render({ form, isPending }) {
      return (
         <div>
            <div>
               <form
                  onSubmit={e => {
                     e.preventDefault();
                     e.stopPropagation();
                  }}
                  className="w-full"
               >
                  <div className="flex flex-col gap-y-8">
                     {isPending ? (
                        <Skeleton className="w-full h-8" />
                     ) : (
                        <form.AppField name="discipline">
                           {field => {
                              return (
                                 <field.SelectField
                                    isControlledInput={true}
                                    value={field.state.value}
                                    suggestion={true}
                                    isMulti={false}
                                    label="Название дисциплины *"
                                    source={API.DISCIPLINES}
                                    queryKey={QUERY_KEYS.TOURNAMENTS}
                                    size="default"
                                 />
                              );
                           }}
                        </form.AppField>
                     )}
                     {isPending ? (
                        <Skeleton className="w-full h-8" />
                     ) : (
                        <form.Subscribe
                           selector={state => state.values.categories}
                        >
                           {() => (
                              <form.AppField name="categories" mode="array">
                                 {categoriesField => (
                                    <categoriesField.SelectField
                                       isControlledSelect={true}
                                       selectedValues={
                                          categoriesField.state.value
                                       }
                                       suggestion={true}
                                       isMulti={true}
                                       label="Название категорий"
                                       size="default"
                                       source={API.CATEGORIES}
                                       queryKey={QUERY_KEYS.TOURNAMENTS}
                                    />
                                 )}
                              </form.AppField>
                           )}
                        </form.Subscribe>
                     )}
                  </div>
               </form>
            </div>
         </div>
      );
   },
});

export default CompetitionForm;
