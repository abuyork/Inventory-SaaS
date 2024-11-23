rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      // Only authenticated users can read products
      allow read: if request.auth != null;
      
      // Only authenticated users can create/update/delete products
      allow write: if request.auth != null;
      
      // Additional validation rules you might want to add:
      // allow create: if request.resource.data.quantity >= 0 
      //              && request.resource.data.parLevel >= 0
      //              && request.resource.data.reorderPoint >= 0;
    }
  }
} 