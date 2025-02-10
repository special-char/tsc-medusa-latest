const GiftImportCsv =
  "data:text/csv;charset=utf-8," +
  `product_handle,quantity,unit_price,firstname,lastname,email,phone,expiryDay,message,emailDeliveryDate(DD/MM/YYYY)
test,1,3350,Linda,Johnson,example@gmail.com,9999999999,30,Hello example,
`

export const getGiftImportCsvTemplate = () => {
  return encodeURI(GiftImportCsv)
}
