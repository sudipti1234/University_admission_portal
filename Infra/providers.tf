
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.55.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.32"
    }

    http = {
      source  = "hashicorp/http"
      version = "~> 3.4"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

# These providers are wired to the live AKS admin kubeconfig
# (defined by data.azurerm_kubernetes_cluster.this in aks_acr.tf)


/* provider "kubernetes" {
  host                   = data.azurerm_kubernetes_cluster.this.kube_admin_config[0].host
  cluster_ca_certificate = base64decode(data.azurerm_kubernetes_cluster.this.kube_admin_config[0].cluster_ca_certificate)
  client_certificate     = base64decode(data.azurerm_kubernetes_cluster.this.kube_admin_config[0].client_certificate)
  client_key             = base64decode(data.azurerm_kubernetes_cluster.this.kube_admin_config[0].client_key)
}
 */

provider "kubernetes" {
  config_path = "C:/Users/SudiptiPatnaha/.kube/config"
}


