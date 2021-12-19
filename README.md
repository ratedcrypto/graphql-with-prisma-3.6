# graphql-with-apollo-server-and-prisma-v3.6

## Environment variables

```
DATABASE_URL="postgres://myuser:mypassword@localhost:5432?schema=public"
SHADOW_DATABASE_URL="postgres://myuser:mypassword@localhost:5432?schema=public"
JWT_SECRET="secret"
```

## Libraries used
-   prisma-client (v3.6)
-   dataloader
-   jsonwebtoken
-   bcryptjs
-   graphql
-   apollo-server
-   validator

## Prisma 

```
npx prisma db push
npx prisma migrate dev --name init
npx prisma migrate dev --name added_relationships --create-only
npx prisma migrate dev --name added_relationships
npx prisma migrate reset
```
