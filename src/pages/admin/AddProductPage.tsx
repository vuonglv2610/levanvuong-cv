import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { get, post } from "services/api";

const AddProductPage = () => {
  const [imgPre, setImgPre] = useState<any>('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { data } = useQuery({ queryKey: ['/categories'], queryFn: () => get('/categories') });
  let dataCategories = data?.data?.result?.data;

  const onSubmit = async (data: any) => {
    let dataAddNew = {
      sku: data.sku,
      name: data.name,
      price: data.price,
      img: imgPre ? imgPre : null,
      quantity: data.quantity,
      description: data.description,
      categoryId: data.category
    }
    // console.log(dataAddNew);
    const res = await post('/products', dataAddNew);
    console.log('res', res)
  }

  const convertToBase64 = (selectedFile: any) => {
    const reader = new FileReader()

    reader.readAsDataURL(selectedFile)

    reader.onload = () => {
      setImgPre(reader.result)
    }
  }

  const handleChangePreImg = (e: any) => {
    convertToBase64(e.target.files?.[0]);
  }


  return (
    <div>
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">SKU</label>
          <input type="text" id="sku" {...register("sku")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
        </div>
        <div className="mb-5">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Name</label>
          <input type="text" id="name"  {...register("name")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
        </div>
        <div className="mb-5">
          <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900">Price</label>
          <input type="price" id="price"  {...register("price")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
        </div>
        <div className="mb-5">
          <label htmlFor="img" className="block mb-2 text-sm font-medium text-gray-900">img</label>
          <input type="file" id="img" {...register("img", { onChange: (e) => handleChangePreImg(e), })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
          <img src={imgPre} className="img-prev object-cover overflow-hidden" alt="#" width={200} height={150} />
        </div>
        <div className="mb-5">
          <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900">quantity</label>
          <input type="number" min="0" {...register("quantity")} defaultValue="0" id="quantity" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
        </div>
        <div className="mb-5">
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">quantity</label>
          <textarea id="description" {...register("description")} rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Description..." defaultValue={""} />
        </div>
        <div className="mb-5">
          <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">Select an option</label>
          <select {...register("category")} id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            {dataCategories && dataCategories.map((item: any, i: number) => {
              return <option value={item.id} key={item.id}>{item.name}</option>
            })}
          </select>
        </div>
        <button type='submit' className='btn-primary'>Add new</button>
      </form>
    </div>
  )
}

export default AddProductPage
