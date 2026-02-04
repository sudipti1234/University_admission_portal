
resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = var.location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                = var.aks_name
  location            = var.location
  resource_group_name = data.azurerm_resource_group.rg.name
  dns_prefix          = "${var.aks_name}-dns"

  kubernetes_version     = length(var.kubernetes_version) > 0 ? var.kubernetes_version : null
  local_account_disabled = false # ensures kube_admin_config is populated

  default_node_pool {
    name                         = "system"
    node_count                   = var.node_count
    vm_size                      = var.node_vm_size
    vnet_subnet_id               = azurerm_subnet.aks.id
    only_critical_addons_enabled = false
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure" # Azure CNI
    load_balancer_sku = "standard"
    dns_service_ip    = "10.2.0.10"
    service_cidr      = "10.2.0.0/24"
    # docker_bridge_cidr = "172.17.0.1/16"
    outbound_type = "loadBalancer"
  }

  role_based_access_control_enabled = true

  depends_on = [azurerm_subnet.aks]
}

# Read the live cluster connection (used by providers)
data "azurerm_kubernetes_cluster" "this" {
  name                = azurerm_kubernetes_cluster.aks.name
  resource_group_name = azurerm_kubernetes_cluster.aks.resource_group_name
  depends_on          = [azurerm_kubernetes_cluster.aks]
}

# Allow the kubelet identity to pull from ACR
resource "azurerm_role_assignment" "aks_acr_pull" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
  depends_on           = [azurerm_container_registry.acr, azurerm_kubernetes_cluster.aks]
}
