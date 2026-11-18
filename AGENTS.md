# Architecture rules

- Load admin orders in bounded pages with page-scoped item queries and cancellable requests, so growing order history does not create oversized URLs or overwhelm phones.
- Load the full book catalog through stable, bounded pages shared by storefront and admin, so API row limits never hide new additions.
- Restrict public catalog reads and checkout to published products; protected admin roles may read and manage unpublished products, while new listings remain published by default for compatibility.
- Capture password-recovery intent before auth consumes URL fragments, route recovery callbacks to the reset page regardless of their landing path, and validate the recovery user before showing reset controls; ordinary sessions must not unlock the recovery form.