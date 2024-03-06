kubectl apply -f ./opaque.yaml      
kubectl apply -f ./svc-db.yaml     
kubectl apply -f ./svc-api.yaml     
kubectl apply -f ./pod-db.yaml
kubectl apply -f ./pod-api.yaml
kubectl apply -f ./metrics.yaml
kubectl apply -f ./hpa.yaml