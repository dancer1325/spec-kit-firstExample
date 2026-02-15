# how has it been created?
* `specify init . --ai claude --script sh`
* | claude chat
  * `/speckit.constitution Create principles focused on code quality, testing standards, user experience consistency, and performance requirements`
    * check it's modified [.specify/memory/constitution.md](.specify/memory/constitution.md)
  * 

    ```bash
    /speckit.specify Build an application that can help me organize my photos in separate photo albums
    * Albums are grouped by date and can be re-organized by dragging and dropping on the main page
    * Albums are never in other nested albums
    * Within each album, photos are previewed in a tile-like interface.
    ```
    * check that it   
      * created ["specs/"](../../../../specs)
      * branched | NEW branch
  * `/speckit.clarify Focus on security and performance requirements.`
  * 
    ```bash
    /speckit.plan The application uses Vite with minimal number of libraries
    * Use vanilla HTML, CSS, and JavaScript as much as possible
    * Images are not uploaded anywhere and metadata is stored in a local SQLite database.
    ```
    * create [specs/*/research.md](specs/001-photo-album-organizer/research.md)
    * modify [specs/*/plan.md](specs/001-photo-album-organizer/plan.md)
  * `/speckit.tasks`
    * create [specs/*/tasks.md](specs/001-photo-album-organizer/tasks.md)
  * `/speckit.analyze`
  * `/speckit.implement`