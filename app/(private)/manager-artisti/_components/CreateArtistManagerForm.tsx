// 'use client';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { useState } from 'react';
// import AvatarUploadInput from './AvatarUploadInput';
// import { Separator } from '@/components/ui/separator';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import { cn } from '@/lib/utils';
// import { CalendarIcon } from 'lucide-react';
// import { format } from 'date-fns';
// import { Calendar } from '@/components/ui/calendar';
// import LanguagesSelect from './LanguagesSelect';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
// } from '@/components/ui/select';
// import { Gender, GENDERS, Language, STATES } from '@/lib/constants';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { artistManagerSignupS1Schema } from '@/lib/validation/artistManagerSignupS1Schema';

// type FormStep1 = {
//   name: string;
//   surname: string;
//   phone: string;
//   email: string;
//   birthDate: Date | undefined;
//   birthPlace: string;
//   languages: Language[];
//   address: string;
//   state: string | undefined;
//   province: string | undefined;
//   city: string;
//   zipCode: string;
//   gender: Gender | undefined;
// };

// type FormStep1Errors = {
//   [key in keyof FormStep1]: string;
// };

// export default function CreateArtistManagerForm() {
//   const [formState, setFormState] = useState<FormStep1>({
//     name: '',
//     surname: '',
//     phone: '',
//     email: '',
//     birthDate: undefined,
//     birthPlace: '',
//     languages: [],
//     address: '',
//     state: undefined,
//     province: undefined,
//     city: '',
//     zipCode: '',
//     gender: undefined,
//   });
//   const [isBirthDateCalendarOpen, setIsBirthDateCalendarOpen] =
//     useState<boolean>(false);
//   const [errors, setErrors] = useState<FormStep1Errors | null>({
//     name: '',
//     surname: '',
//     phone: '',
//     email: '',
//     birthDate: '',
//     birthPlace: '',
//     languages: '',
//     address: '',
//     state: '',
//     province: '',
//     city: '',
//     zipCode: '',
//     gender: '',
//   });
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const provinces = formState.state
//     ? STATES.find((state) => state.name == formState.state)?.provinces
//     : [];

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setIsLoading(true);

//     const validation = artistManagerSignupS1Schema.safeParse(formState);

//     if (!validation.success) {
//       setErrors(null);
//       setIsLoading(false);
//       return;
//     } else {
//       setErrors(null);
//     }

//     try {
//     } catch (error) {
//       console.error('Error: ', error instanceof Error ? error.message : error);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       noValidate
//     >
//       <div className='grid grid-cols-[auto_1fr_1fr] items-end gap-4 mb-4'>
//         <AvatarUploadInput />
//         {/* name */}
//         <div className='flex flex-col'>
//           <label
//             htmlFor='name'
//             className='block text-sm font-semibold mb-2'
//           >
//             Nome
//           </label>
//           <Input
//             id='name'
//             type='text'
//             value={formState.name || ''}
//             placeholder='Mario'
//             onChange={(e) =>
//               setFormState((prev) => ({ ...prev, name: e.target.value }))
//             }
//             className={errors.name ? 'border-destructive text-destructive' : ''}
//             autoComplete='name'
//           />
//           {errors.name && (
//             <p className='text-xs text-destructive mt-2'>{errors.name}</p>
//           )}
//         </div>
//         {/* surname */}
//         <div className='flex flex-col'>
//           <label
//             htmlFor='surname'
//             className='block text-sm font-semibold mb-2'
//           >
//             Cognome
//           </label>
//           <Input
//             id='surname'
//             type='text'
//             value={formState.surname || ''}
//             placeholder='Rossi'
//             onChange={(e) =>
//               setFormState((prev) => ({ ...prev, surname: e.target.value }))
//             }
//             className={
//               errors.surname ? 'border-destructive text-destructive' : ''
//             }
//             autoComplete='family-name'
//           />
//           {errors.surname && (
//             <p className='text-xs text-destructive mt-2'>{errors.surname}</p>
//           )}
//         </div>
//       </div>
//       {/* phone */}
//       <div className='flex flex-col mb-4'>
//         <label
//           htmlFor='phone'
//           className='block text-sm font-semibold mb-2'
//         >
//           Numero di telefono
//         </label>
//         <Input
//           id='phone'
//           type='text'
//           value={formState.phone || ''}
//           placeholder='+39 123456789'
//           onChange={(e) =>
//             setFormState((prev) => ({ ...prev, phone: e.target.value }))
//           }
//           className={errors.phone ? 'border-destructive text-destructive' : ''}
//           autoComplete='tel'
//         />
//         {errors.phone && (
//           <p className='text-xs text-destructive mt-2'>{errors.phone}</p>
//         )}
//       </div>
//       {/* email */}
//       <div className='flex flex-col'>
//         <label
//           htmlFor='email'
//           className='block text-sm font-semibold mb-2'
//         >
//           Email
//         </label>
//         <Input
//           id='email'
//           type='email'
//           value={formState.email || ''}
//           placeholder='info@eaglebooking.it'
//           onChange={(e) =>
//             setFormState((prev) => ({ ...prev, email: e.target.value }))
//           }
//           className={errors.email ? 'border-destructive text-destructive' : ''}
//           autoComplete='email'
//         />
//         {errors.email && (
//           <p className='text-xs text-destructive mt-2'>{errors.email}</p>
//         )}
//       </div>
//       <Separator className='my-6' />
//       <div className='grid grid-cols-2 gap-4 mb-4'>
//         {/* birthDate */}
//         <div className='flex flex-col'>
//           <label
//             htmlFor='birthDate'
//             className='block text-sm font-semibold mb-2'
//           >
//             Data di nascita
//           </label>
//           <Popover
//             modal
//             open={isBirthDateCalendarOpen}
//             onOpenChange={setIsBirthDateCalendarOpen}
//           >
//             <PopoverTrigger asChild>
//               <Button
//                 variant='outline'
//                 size='sm'
//                 className={cn(
//                   'justify-between font-normal',
//                   !formState.birthDate && 'text-muted-foreground',
//                   errors.birthDate ? 'border-destructive text-destructive' : ''
//                 )}
//               >
//                 {formState.birthDate
//                   ? format(formState.birthDate, 'dd/MM/yyyy')
//                   : 'Seleziona data'}
//                 <CalendarIcon />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent
//               className='w-auto p-0'
//               align='start'
//             >
//               <Calendar
//                 mode='single'
//                 selected={formState.birthDate || undefined}
//                 onSelect={(date) => {
//                   if (date) {
//                     setFormState((prev) => ({ ...prev, birthDate: date }));
//                     setIsBirthDateCalendarOpen(false);
//                   }
//                 }}
//                 hidden={{ after: new Date() }}
//               />
//             </PopoverContent>
//           </Popover>
//           {errors.birthDate && (
//             <p className='text-xs text-destructive mt-2'>{errors.birthDate}</p>
//           )}
//         </div>
//         {/* birthPlace */}
//         <div className='flex flex-col'>
//           <label
//             htmlFor='birthPlace'
//             className='block text-sm font-semibold mb-2'
//           >
//             Luogo di nascita
//           </label>
//           <Input
//             id='birthPlace'
//             type='text'
//             value={formState.birthPlace || ''}
//             placeholder='Milano'
//             onChange={(e) =>
//               setFormState((prev) => ({ ...prev, birthPlace: e.target.value }))
//             }
//             className={
//               errors.birthPlace ? 'border-destructive text-destructive' : ''
//             }
//           />
//           {errors.birthPlace && (
//             <p className='text-xs text-destructive mt-2'>{errors.birthPlace}</p>
//           )}
//         </div>
//       </div>
//       {/* languages */}
//       <LanguagesSelect
//         state={formState}
//         setState={setFormState}
//       />
//       <Separator className='my-6' />
//       {/* address */}
//       <div className='flex flex-col mb-4'>
//         <label
//           htmlFor='address'
//           className='block text-sm font-semibold mb-2'
//         >
//           Indirizzo di residenza
//         </label>
//         <Input
//           id='address'
//           type='text'
//           value={formState.address || ''}
//           placeholder='Via Duomo 1'
//           onChange={(e) =>
//             setFormState((prev) => ({ ...prev, name: e.target.value }))
//           }
//           className={
//             errors.address ? 'border-destructive text-destructive' : ''
//           }
//           autoComplete='street-address'
//         />
//         {errors.address && (
//           <p className='text-xs text-destructive mt-2'>{errors.address}</p>
//         )}
//       </div>
//       <div className='grid grid-cols-2 gap-4 mb-4'>
//         {/* state */}
//         <div className='flex flex-col'>
//           <label
//             htmlFor='state'
//             className='block text-sm font-semibold mb-2'
//           >
//             Stato
//           </label>
//           <Select
//             value={formState.state}
//             onValueChange={(stateName) => {
//               const state = STATES.some((state) => state.name == stateName);
//               if (!state) return;

//               setFormState((prev) => ({ ...prev, state: stateName }));
//             }}
//           >
//             <SelectTrigger
//               className='w-full'
//               size='sm'
//             >
//               {formState.state ? formState.state : 'Seleziona uno stato'}
//             </SelectTrigger>
//             <SelectContent>
//               {STATES.map((state, index) => (
//                 <SelectItem
//                   key={index}
//                   value={state.name}
//                 >
//                   {state.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           {errors.state && (
//             <p className='text-xs text-destructive mt-2'>{errors.state}</p>
//           )}
//         </div>
//         {/* province */}
//         <div className='flex flex-col'>
//           <label
//             htmlFor='province'
//             className='block text-sm font-semibold mb-2'
//           >
//             Provincia
//           </label>
//           <Select
//             value={formState.province}
//             disabled={!formState.state}
//             onValueChange={(province) => {
//               setFormState((prev) => ({ ...prev, province: province }));
//             }}
//           >
//             <SelectTrigger
//               className='w-full'
//               size='sm'
//             >
//               {formState.province
//                 ? formState.province
//                 : formState.state
//                 ? 'Seleziona una provincia'
//                 : 'Seleziona uno stato'}
//             </SelectTrigger>
//             <SelectContent>
//               {formState.state &&
//                 provinces &&
//                 provinces.map((province, index) => (
//                   <SelectItem
//                     key={index}
//                     value={province}
//                   >
//                     {province}
//                   </SelectItem>
//                 ))}
//             </SelectContent>
//           </Select>
//           {errors.province && (
//             <p className='text-xs text-destructive mt-2'>{errors.province}</p>
//           )}
//         </div>
//       </div>
//       <div className='grid grid-cols-2 gap-4 mb-4'>
//         {/* city */}
//         <div className='flex flex-col mb-4'>
//           <label
//             htmlFor='city'
//             className='block text-sm font-semibold mb-2'
//           >
//             Comune
//           </label>
//           <Input
//             id='city'
//             type='text'
//             value={formState.city || ''}
//             placeholder='Milano'
//             onChange={(e) =>
//               setFormState((prev) => ({ ...prev, city: e.target.value }))
//             }
//             className={errors.city ? 'border-destructive text-destructive' : ''}
//           />
//           {errors.city && (
//             <p className='text-xs text-destructive mt-2'>{errors.city}</p>
//           )}
//         </div>
//         {/* zip-code */}
//         <div className='flex flex-col mb-4'>
//           <label
//             htmlFor='zip-code'
//             className='block text-sm font-semibold mb-2'
//           >
//             CAP
//           </label>
//           <Input
//             id='zip-code'
//             type='text'
//             value={formState.zipCode || ''}
//             placeholder='20100'
//             onChange={(e) =>
//               setFormState((prev) => ({ ...prev, zipCode: e.target.value }))
//             }
//             className={
//               errors.zipCode ? 'border-destructive text-destructive' : ''
//             }
//           />
//           {errors.zipCode && (
//             <p className='text-xs text-destructive mt-2'>{errors.zipCode}</p>
//           )}
//         </div>
//       </div>
//       <Separator className='my-6' />
//       {/* gender */}
//       <div className='flex flex-col mb-4'>
//         <label
//           htmlFor='gender'
//           className='block text-sm font-semibold mb-2'
//         >
//           Sesso
//         </label>
//         <RadioGroup
//           value={formState.gender}
//           onValueChange={(gender: Gender) => {
//             if (!GENDERS.includes(gender)) return;
//             setFormState((prev) => ({ ...prev, gender }));
//           }}
//           className='flex gap-2'
//         >
//           {GENDERS.map((gender) => (
//             <label
//               htmlFor={gender}
//               key={gender}
//               className='h-10 flex items-center gap-2 text-sm p-2 rounded-xl border hover:cursor-pointer'
//             >
//               <RadioGroupItem
//                 value={gender}
//                 id={gender}
//               />
//               {gender}
//             </label>
//           ))}
//         </RadioGroup>
//         {errors.gender && (
//           <p className='text-xs text-destructive mt-2'>{errors.gender}</p>
//         )}
//       </div>

//       <div className='flex justify-end'>
//         <Button variant='default'>Continua</Button>
//       </div>
//     </form>
//   );
// }
