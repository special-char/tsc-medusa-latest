const GiftImportCsv =
  "data:text/csv;charset=utf-8," +
  `product_handle,quantity,unit_price,firstname,lastname,email,phone,expiryDay,message,emailDeliveryDate(DD/MM/YYYY),time(HH:MM)
test,1,3350,Linda,Johnson,example@gmail.com,9999999999,30,Hello example,27/02/2025,24:00
`

export const getGiftImportCsvTemplate = () => {
  return encodeURI(GiftImportCsv)
}
