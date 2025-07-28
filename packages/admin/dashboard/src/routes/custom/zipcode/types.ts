export interface Cepcode {
  id: string
  cep_initial: string
  cep_final: string
  uf: string
  ibge_code: string
  ibge_name: string
  ibge_base: string
  risk: string
  time: string
  service_type: string
  commercial_location: string
  commercial_geography: string
  metadata?: Record<string, any> | null
  created_at?: string
  updated_at?: string
}

export interface CepcodesResponse {
  cepcodes: Cepcode[]
  count: number
  limit: number
  offset: number
}
