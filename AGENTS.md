# Architecture rules

- Load admin orders in bounded pages with page-scoped item queries and cancellable requests, so growing order history does not create oversized URLs or overwhelm phones.
- Load the full book catalog through stable, bounded pages shared by storefront and admin, so API row limits never hide new additions.