######## POD-RESTART-ALERT ########
max by (pod, container, node) (
  increase(kube_pod_container_status_restarts_total[1m])
  * on (pod, namespace) group_left(node)
    kube_pod_info
)


##### POD-STATUS-ALERT ########

sum by (pod, namespace, phase) (
  kube_pod_status_phase{job="kubernetes-state-metrics", phase!~"^(Running|Unknown)$"}
)
* on (pod, namespace) group_left(node)
max by (pod, namespace, node) (
  kube_pod_info{job="kubernetes-state-metrics"}
)

########### LIVE-LOAD-ALERT ##########
avg by (instance_ip, instance_name, k8s_node_group_name) (
  (
    100 * (
      1 - avg by (instance) (
        rate(node_cpu_seconds_total{mode="idle", job="on-ec2"}[5m])
      )
      /
      avg by (instance) (
        sum without (mode) (rate(node_cpu_seconds_total{job="on-ec2"}[5m]))
      )
    )
  )
  * on (instance) group_left(instance_ip, instance_name, k8s_node_group_name)
  max by (instance, instance_ip, instance_name, k8s_node_group_name) (
    node_cpu_seconds_total{job="on-ec2", mode="idle"} * 0 + 1
  )
)



######### LIVE-RAM-ALERT #############
avg by (instance_ip, instance_name, k8s_node_group_name) (
  (
    100 * (
      1 - (
        node_memory_MemAvailable_bytes{job="on-ec2"}
        /
        node_memory_MemTotal_bytes{job="on-ec2"}
      )
    )
  )
  * on (instance) group_left(instance_ip, instance_name, k8s_node_group_name)
  max by (instance, instance_ip, instance_name, k8s_node_group_name) (
    node_memory_MemTotal_bytes{job="on-ec2"} * 0 + 1
  )
)



########### LIVE-CPU-ALERT #################

avg by (instance_ip, instance_name, k8s_node_group_name) (
  (
    100 - (
      avg(irate(node_cpu_seconds_total{mode="idle", job="on-ec2"}[1m])) 
      by (instance)
      * 100
    )
  )
  * on (instance) group_left(instance_ip, instance_name, k8s_node_group_name)
  max by (instance, instance_ip, instance_name, k8s_node_group_name) (
    node_cpu_seconds_total{job="on-ec2"} * 0 + 1
  )
)


######### LIVE-DISK-ALERT #############

avg by (instance_ip, instance_name, k8s_node_group_name) (
  (
    100 - (
      node_filesystem_avail_bytes{job="on-ec2", mountpoint="/", fstype!="rootfs"} * 100
      / 
      node_filesystem_size_bytes{job="on-ec2", mountpoint="/", fstype!="rootfs"}
    )
  )
  * on (instance) group_left(instance_ip, instance_name, k8s_node_group_name)
  max by (instance, instance_ip, instance_name, k8s_node_group_name) (
    node_filesystem_size_bytes{job="on-ec2", mountpoint="/", fstype!="rootfs"} * 0 + 1
  )
)




######### rabbitmq_queue_messages_unacked #########

rabbitmq_queue_messages_unacked





##########  RABBITMQ-LIVE-NODE-DOWN ############
up{job="rabbitmq"}




##########    RDS-DISK-PSQL-ALERT ###############
SEARCH('{AWS/RDS,DBInstanceIdentifier} MetricName="FreeStorageSpace" DBInstanceIdentifier=("your-prod-psql-db-aps1-instance-1" OR "your-prod-psql-db-aps1-instance-2" OR "your-prod-psql-db-aps1-instance-3")', 'Minimum', 300)



#########    RDS-RAM-PSQL-ALERT  #########
SEARCH('{AWS/RDS,DBInstanceIdentifier} MetricName="FreeableMemory" DBInstanceIdentifier=("your-prod-psql-db-aps1-instance-1" OR "your-prod-psql-db-aps1-instance-2" OR "your-prod-psql-db-aps1-instance-3")', 'Average', 300)



###### RDS-RAM-PSQL-ALERT #########
cpuutilization
