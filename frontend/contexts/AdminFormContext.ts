"use client";

import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import SelectField from "../components/UI/form/SelectField";
import BaseFormInput from "../components/UI/inputs/BaseFormInput";
import SubmitButton from "../components/UI/form/SubmitButton";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
   createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
   fieldContext,
   formContext,
   fieldComponents: {
      SelectField,
      BaseFormInput,
   },
   formComponents: {
      SubmitButton,
   },
});
