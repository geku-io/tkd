"use client";

import React from "react";
import InputAndSelect, { ISelectProps } from "../inputs/InputAndSelect";
import { useFieldContext } from "../../../contexts/AdminFormContext";

const SelectField = (props: ISelectProps) => {
   const field = useFieldContext<string | string[]>();

   const fieldMeta = field.state.meta;

   const isValid =
      fieldMeta.isValid || (!fieldMeta.isBlurred && !fieldMeta.isTouched);

   const changeHandler = (value: string) => {
      if (Array.isArray(field.state.value)) {
         field.pushValue(value);
      } else {
         field.handleChange(value);
      }
      field.validate("blur");
   };

   const blurHandler = () => {
      field.handleBlur();
   };

   const unselectHandler = (val: string) => {
      if (Array.isArray(field.state.value)) {
         const index = field.state.value.findIndex(item => item === val);
         if (index !== -1) {
            field.removeValue(index);
         }
      }
   };

   return (
      <InputAndSelect
         isValid={isValid}
         changeHandler={changeHandler}
         blurHandler={blurHandler}
         unselectHandler={unselectHandler}
         validation={true}
         errorMessage={fieldMeta.errors[0]?.message}
         {...props}
      />
   );
};

export default SelectField;
