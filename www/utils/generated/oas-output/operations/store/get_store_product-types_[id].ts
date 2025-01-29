/**
 * @oas [get] /store/product-types/{id}
 * operationId: GetProductTypesId
 * summary: Get a Product Type
 * description: Retrieve a product type by its ID. You can expand the product type's relations or select the fields that should be returned.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The product type's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: x-publishable-api-key
 *     in: header
 *     description: Publishable API Key created in the Medusa Admin.
 *     required: true
 *     schema:
 *       type: string
 *       externalDocs:
 *         url: https://docs.medusajs.com/api/store#publishable-api-key
 *   - name: fields
 *     in: query
 *     description: |-
 *       Comma-separated fields that should be included in the returned data.
 *        if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *        without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. Without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/store/product-types/{id}' \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}'
 * tags:
 *   - Product Types
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreProductTypeResponse"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * 
*/

