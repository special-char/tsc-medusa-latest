/**
 * @oas [post] /admin/customers/{id}/customer-groups
 * operationId: PostCustomersIdCustomerGroups
 * x-sidebar-summary: Manage Customer Groups
 * summary: Manage Customer Groups of Customer
 * description: Manage the customer groups of a customer, adding or removing the customer from those groups.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The customer's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: fields
 *     in: query
 *     description: |-
 *       "Comma-separated fields that should be included in the returned data.
 *       if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *       without prefix it will replace the entire default fields. NOTE: This route doesn't allow expanding custom relations."
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: "Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. Without prefix it will replace the entire default fields. NOTE: This route doesn't allow expanding custom relations."
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         properties:
 *           add:
 *             type: array
 *             description: The customer groups to add the customer to.
 *             items:
 *               type: string
 *               title: add
 *               description: The ID of the group to add the customer to.
 *           remove:
 *             type: array
 *             description: The customer groups to remove the customer from.
 *             items:
 *               type: string
 *               title: remove
 *               description: The ID of the group to remove the customer from.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/customers/{id}/customer-groups' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Customers
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminCustomerResponse"
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
 * x-workflow: linkCustomerGroupsToCustomerWorkflow
 * 
*/

