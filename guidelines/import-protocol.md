# Source registration and import protocol

Use this protocol for every new upstream source and every subsequent curation
batch. Source registration and pattern import may happen in separate pull
requests. Never import a pattern from a source whose registry status is not
`active` or whose license status is not `verified`.

## 1. Verify the upstream

1. Confirm the canonical repository and its owner/repository slug.
2. Review repository activity, maintenance, and the files in the proposed scope.
3. Record the repository in `source-registry.json` with a stable kebab-case ID.
4. Keep the source `planned` until every requirement below is complete.

## 2. Verify the license

1. Read the license from the exact upstream revision proposed for import.
2. Confirm that redistribution and adaptation are permitted for the intended files.
3. Record the verified license name and immutable upstream license URL.
4. Preserve the verified text and notice in `licenses/<source-id>-<license>.md`
   when redistribution requires or benefits from a local copy.
5. Set `license.status` to `verified`. Never infer or reconstruct license text.

## 3. Define provenance rules

1. Choose an immutable upstream revision, normally a full commit SHA.
2. Configure `provenance.sourceUrlPattern` with named `revision` and `path`
   captures.
3. Set `revisionRequired` according to the source policy.
4. Set the source status to `active` only after its license and provenance rules
   are complete and validation passes.

## 4. Define and curate the batch

1. State the import scope, categories, exclusions, and target batch size.
2. Check the catalog for equivalent or near-duplicate patterns.
3. Select a small reviewable set; never mirror an upstream repository.
4. Normalize each pattern into a self-contained package with `README.md`,
   `demo.html`, and `style.css`.
5. Preserve the visual idea while removing unnecessary dependencies and assets.
6. Record the source ID, immutable source URL, revision, adaptation type, and
   compatible license in `catalog.json`.
7. Include the exact URL, creator attribution, license, and adaptation statement
   in the pattern README.

## 5. Review quality

Review semantic HTML, keyboard access, focus visibility, touch behavior, reduced
motion, narrow layouts, browser support, performance, and production status.
Verify that CSS selectors and keyframes are scoped and that local references are
complete.

## 6. Validate and submit

Run:

```sh
npm ci
npm test
npm run validate
git diff --check
```

Open a focused pull request containing the registry change, license evidence,
catalog migration, pattern packages, and validation output. Do not merge the
pull request automatically.
