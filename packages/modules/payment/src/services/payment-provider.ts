import {
  BigNumberInput,
  CreatePaymentProviderSession,
  DAL,
  IPaymentProvider,
  Logger,
  PaymentMethodResponse,
  PaymentProviderAuthorizeResponse,
  PaymentProviderContext,
  PaymentProviderDataInput,
  PaymentProviderError,
  PaymentProviderSessionResponse,
  PaymentSessionStatus,
  ProviderWebhookPayload,
  SavePaymentMethod,
  SavePaymentMethodResponse,
  UpdatePaymentProviderSession,
  WebhookActionResult,
} from "@medusajs/framework/types"
import { MedusaError, ModulesSdkUtils } from "@medusajs/framework/utils"
import { PaymentProvider } from "@models"
import { EOL } from "os"

type InjectedDependencies = {
  logger?: Logger
  paymentProviderRepository: DAL.RepositoryService
  [key: `pp_${string}`]: IPaymentProvider
}

export default class PaymentProviderService extends ModulesSdkUtils.MedusaInternalService<InjectedDependencies>(
  PaymentProvider
) {
  #logger: Logger

  constructor(container: InjectedDependencies) {
    super(container)
    this.#logger = container["logger"]
      ? container.logger
      : (console as unknown as Logger)
  }

  retrieveProvider(providerId: string): IPaymentProvider {
    try {
      return this.__container__[providerId] as IPaymentProvider
    } catch (err) {
      if (err.name === "AwilixResolutionError") {
        const errMessage = `
Unable to retrieve the payment provider with id: ${providerId}
Please make sure that the provider is registered in the container and it is configured correctly in your project configuration file.`
        throw new Error(errMessage)
      }

      const errMessage = `Unable to retrieve the payment provider with id: ${providerId}, the following error occurred: ${err.message}`
      this.#logger.error(errMessage)

      throw new Error(errMessage)
    }
  }

  async createSession(
    providerId: string,
    sessionInput: CreatePaymentProviderSession
  ): Promise<PaymentProviderSessionResponse["data"]> {
    const provider = this.retrieveProvider(providerId)

    const paymentResponse = await provider.initiatePayment(sessionInput)

    if (isPaymentProviderError(paymentResponse)) {
      this.throwPaymentProviderError(paymentResponse)
    }

    return (paymentResponse as PaymentProviderSessionResponse).data
  }

  async updateSession(
    providerId: string,
    sessionInput: UpdatePaymentProviderSession
  ): Promise<PaymentProviderSessionResponse["data"]> {
    const provider = this.retrieveProvider(providerId)

    const paymentResponse = await provider.updatePayment(sessionInput)

    if (isPaymentProviderError(paymentResponse)) {
      this.throwPaymentProviderError(paymentResponse)
    }

    return (paymentResponse as PaymentProviderSessionResponse)?.data
  }

  async deleteSession(input: PaymentProviderDataInput): Promise<void> {
    const provider = this.retrieveProvider(input.provider_id)

    const error = await provider.deletePayment(input.data)
    if (isPaymentProviderError(error)) {
      this.throwPaymentProviderError(error)
    }
  }

  async authorizePayment(
    input: PaymentProviderDataInput,
    context: Record<string, unknown>
  ): Promise<{ data: Record<string, unknown>; status: PaymentSessionStatus }> {
    const provider = this.retrieveProvider(input.provider_id)

    const res = await provider.authorizePayment(input.data, context)
    if (isPaymentProviderError(res)) {
      this.throwPaymentProviderError(res)
    }

    const { data, status } = res as PaymentProviderAuthorizeResponse
    return { data, status }
  }

  async getStatus(
    input: PaymentProviderDataInput
  ): Promise<PaymentSessionStatus> {
    const provider = this.retrieveProvider(input.provider_id)
    return await provider.getPaymentStatus(input.data)
  }

  async capturePayment(
    input: PaymentProviderDataInput
  ): Promise<Record<string, unknown>> {
    const provider = this.retrieveProvider(input.provider_id)

    const res = await provider.capturePayment(input.data)
    if (isPaymentProviderError(res)) {
      this.throwPaymentProviderError(res)
    }

    return res as Record<string, unknown>
  }

  async cancelPayment(input: PaymentProviderDataInput): Promise<void> {
    const provider = this.retrieveProvider(input.provider_id)

    const error = await provider.cancelPayment(input.data)
    if (isPaymentProviderError(error)) {
      this.throwPaymentProviderError(error)
    }
  }

  async refundPayment(
    input: PaymentProviderDataInput,
    amount: BigNumberInput
  ): Promise<Record<string, unknown>> {
    const provider = this.retrieveProvider(input.provider_id)

    const res = await provider.refundPayment(input.data, amount)
    if (isPaymentProviderError(res)) {
      this.throwPaymentProviderError(res)
    }

    return res as Record<string, unknown>
  }

  async listPaymentMethods(
    providerId: string,
    context: PaymentProviderContext
  ): Promise<PaymentMethodResponse[]> {
    const provider = this.retrieveProvider(providerId)
    if (!provider.listPaymentMethods) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Provider ${providerId} does not support listing payment methods`
      )
    }

    return await provider.listPaymentMethods(context)
  }

  async savePaymentMethod(
    providerId: string,
    input: SavePaymentMethod
  ): Promise<SavePaymentMethodResponse> {
    const provider = this.retrieveProvider(providerId)
    if (!provider.savePaymentMethod) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Provider ${providerId} does not support saving payment methods`
      )
    }

    const res = await provider.savePaymentMethod(input)

    if (isPaymentProviderError(res)) {
      this.throwPaymentProviderError(res)
    }

    return res as SavePaymentMethodResponse
  }

  async getWebhookActionAndData(
    providerId: string,
    data: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const provider = this.retrieveProvider(providerId)

    return await provider.getWebhookActionAndData(data)
  }

  private throwPaymentProviderError(errObj: PaymentProviderError) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `${errObj.error}${errObj.detail ? `:${EOL}${errObj.detail}` : ""}`,
      errObj.code
    )
  }
}

function isPaymentProviderError(obj: any): obj is PaymentProviderError {
  return (
    obj &&
    typeof obj === "object" &&
    "error" in obj &&
    "code" in obj &&
    "detail" in obj
  )
}
