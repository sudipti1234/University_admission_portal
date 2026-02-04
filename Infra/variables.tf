
variable "subscription_id" {
  description = "Azure Subscription ID (optional if using CLI auth)"
  type        = string
  default     = "d008c7cc-9795-4292-bf79-74ae52cda63d"
}

variable "location" {
  type    = string
  default = "Central India"
}

variable "rg_name" { type = string }
variable "acr_name" { type = string }
variable "aks_name" { type = string }

variable "vnet_cidr" {
  type    = string
  default = "10.20.0.0/16"
}

variable "subnet_cidr" {
  type    = string
  default = "10.20.1.0/24"
}

variable "node_count" {
  type    = number
  default = 2
}

variable "node_vm_size" {
  type    = string
  default = "Standard_D2s_v3"
}

# Optional. Leave empty to let AKS choose a version
variable "kubernetes_version" {
  type        = string
  default     = ""
  description = "Optional. Leave empty to use AKS default, or set a supported version like 1.29.x"
}
