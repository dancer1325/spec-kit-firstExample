# how has it been created?
* `specify init . --ai claude --script sh`
* `/speckit.constitution Create principles focused on code quality, testing standards, user experience consistency, and performance requirements`
  * check it's modified [.specify/memory/constitution.md](.specify/memory/constitution.md)
* follow [Workflows' quickstart](https://github.com/dancer1325/spec-kit/tree/main/workflows)
  * Problems:
    * Problem1: "integration 'auto' CLI not found or not installed"
      * Attempt1: `specify workflow run speckit --input spec="Build a user authentication system with OAuth support" --input integration=kiro-cli`
        * issue:
      * Solution: TODO:

# CLI commands
* `specify integration list`
* `specify integration list --catalog`