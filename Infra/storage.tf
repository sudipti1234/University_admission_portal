
resource "kubernetes_storage_class_v1" "persistent_disk_volume" {
  metadata {
    name = "mongo-persistent-volume"
  }
  storage_provisioner = "disk.csi.azure.com"

  parameters = {
    skuName = "Premium_LRS" # or StandardSSD_LRS, Standard_LRS, Premium_ZRS (region-dependent)
  }

  reclaim_policy      = "Retain"
  volume_binding_mode = "WaitForFirstConsumer"
}
