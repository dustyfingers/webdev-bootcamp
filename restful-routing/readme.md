
REST - a mapping between HTTP routes and CRUD

7 ROUTES
4 FUNCTIONALITIES
CREATE
READ      
UPDATE    
DESTROY  


ALL 7 OF THEM

Name      Path              HTTP Verb      Purpose
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Index     /dogs             GET            list all dogs
New       /dogs/new         GET            show new dog form
Create    /dogs             POST           create a new dog then redirect somewhere
Show      /dogs/:id         GET            show info about one specific dog
Edit      /dogs/:id/edit    GET            show edit form for one specific dog
Update    /dogs/:id         PUT            update a particular dog, then redirect somewhere
Destroy   /dogs/:id         DELETE         delete a particular dog, then redirect somewhere
