import React, { FC, useEffect } from 'react';
import { Field } from './field';
import { Form, minLength, required, Values, SubmitResult } from './form';
import { Page } from './page';
import { addTask } from './tasks-data';

export const AddTaskPage = () => {
   const handleSubmit = async (values: Values) => {
      const task = await addTask({
         title: values.title,
         content: values.content,
         // userName: 'Lexa',
         createdAt: new Date(),
      });
      return { success: task ? true : false };
   };

   return (
      <Page title="New Task">
         <Form
            submitCaption="Submit Your Task"
            validationRules={{
               title: [
                  { validator: required },
                  { validator: minLength, arg: 4 },
               ],
               content: [
                  { validator: required },
                  { validator: minLength, arg: 20 },
               ],
            }}
            onSubmit={handleSubmit}
            failureMessage="There was a problem with your Task"
            successMessage="Your Task was successfully submited"
         >
            <Field name="title" label="Title" />
            <Field name="content" label="Content" type="TextArea" />
         </Form>
      </Page>
   );
};
