# Tasks: Photo Album Organizer

**Input**: Design documents from `/specs/001-photo-album-organizer/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/tauri-commands.md

**TDD Requirement**: Per project constitution, all implementation tasks must follow Test-Driven Development:
1. Write tests first for each feature
2. Obtain user approval of test scenarios
3. Verify tests fail (Red phase)
4. Implement minimal code to pass (Green phase)
5. Refactor with confidence

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

Project uses Tauri desktop application structure:
- Frontend: `src/` (Vite + Vanilla JS)
- Backend: `src-tauri/src/` (Rust)
- Tests: `tests/` (Vitest unit/integration, WebDriverIO E2E)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Tauri project with Vite frontend in repository root
- [ ] T002 [P] Configure package.json with Vite, Vitest, and Pica dependencies
- [ ] T003 [P] Configure src-tauri/Cargo.toml with tauri-plugin-sql and image processing dependencies
- [ ] T004 [P] Setup ESLint configuration in .eslintrc.json with zero-warning enforcement
- [ ] T005 [P] Setup Prettier configuration in .prettierrc
- [ ] T006 [P] Configure Vitest in vitest.config.js for unit and integration tests
- [ ] T007 Create project directory structure (src/, src-tauri/, tests/) per plan.md
- [ ] T008 [P] Setup Tauri permissions in src-tauri/tauri.conf.json for file system access
- [ ] T009 [P] Create index.html entry point in src/index.html
- [ ] T010 [P] Create main.js application entry point in src/main.js
- [ ] T011 [P] Configure build scripts to fail on any ESLint/Prettier warnings
- [ ] T012 [P] Add pre-commit hook to enforce zero-warning policy

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database & Models

- [ ] T013 Implement database schema creation in src-tauri/src/database.rs (albums and photos tables from data-model.md)
- [ ] T014 [P] Create Album struct model in src-tauri/src/models.rs
- [ ] T015 [P] Create Photo struct model in src-tauri/src/models.rs

### Contract Tests (TDD: Write Tests FIRST)

**TDD Red Phase**: Write contract tests for all Tauri command interfaces before implementing commands

- [ ] T016 [P] Write contract tests for initialize_database command in tests/contract/database.test.js
- [ ] T017 [P] Write contract tests for get_albums command in tests/contract/albums.test.js
- [ ] T018 [P] Write contract tests for get_photos command in tests/contract/photos.test.js
- [ ] T019 [P] Write contract tests for generate_thumbnail command in tests/contract/photos.test.js
- [ ] T020 [P] Write contract tests for create_album command in tests/contract/albums.test.js
- [ ] T021 [P] Write contract tests for open_file_picker command in tests/contract/files.test.js
- [ ] T022 [P] Write contract tests for validate_image_file command in tests/contract/validation.test.js
- [ ] T023 [P] Write contract tests for add_photos command in tests/contract/photos.test.js
- [ ] T024 [P] Write contract tests for update_album_order command in tests/contract/albums.test.js
- [ ] T025 [P] Write contract tests for update_album command in tests/contract/albums.test.js
- [ ] T026 [P] Write contract tests for delete_album command in tests/contract/albums.test.js
- [ ] T027 [P] Write contract tests for remove_photo command in tests/contract/photos.test.js

**User Approval Checkpoint**:
- [ ] T028 Present contract tests to user for review and approval

**TDD Red Phase Verification**:
- [ ] T029 Run contract tests and verify all fail (no implementations exist yet)

### Core Infrastructure Implementation

- [ ] T030 Implement initialize_database Tauri command in src-tauri/src/commands.rs
- [ ] T031 [P] Implement file validation module in src-tauri/src/validation.rs (magic bytes checking)
- [ ] T032 [P] Implement image thumbnail generation in src-tauri/src/photos.rs using Rust image crate
- [ ] T033 Create dbService.js wrapper in src/services/dbService.js for database initialization
- [ ] T034 [P] Create base CSS styles in src/styles/main.css (layout, typography, colors)
- [ ] T035 [P] Create utility functions in src/utils/dateFormatter.js for ISO 8601 date handling
- [ ] T036 Setup Tauri application in src-tauri/src/main.rs with command registration

### Database Verification (Constitutional Requirement)

- [ ] T037 Create database query performance benchmarks in tests/performance/db-queries.test.js
- [ ] T038 Verify all database queries use indexes with EXPLAIN analysis tests

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View and Browse Albums (Priority: P1) 🎯 MVP

**Goal**: Users can view all albums sorted by date on main page and click into albums to see photos in tile layout

**Independent Test**: Create sample albums with photos via database, launch app, verify albums display sorted by date, click album, verify photos display in tile grid

**TDD Workflow**: Write tests → Approve → Verify fail → Implement → Verify pass

### Backend Tests for User Story 1 (TDD Red Phase)

**Write tests FIRST before implementation**

- [ ] T039 [P] [US1] Write unit tests for get_albums Tauri command in tests/unit/commands/albums.test.js
- [ ] T040 [P] [US1] Write unit tests for get_photos Tauri command in tests/unit/commands/photos.test.js
- [ ] T041 [P] [US1] Write unit tests for generate_thumbnail Tauri command in tests/unit/commands/thumbnails.test.js

**User Approval Checkpoint**:
- [ ] T042 [US1] Present backend tests to user for approval

**TDD Red Phase Verification**:
- [ ] T043 [US1] Run tests and verify all fail (no implementations exist yet)

### Backend Implementation for User Story 1 (TDD Green Phase)

- [ ] T044 [P] [US1] Implement get_albums Tauri command in src-tauri/src/commands.rs (query albums from database)
- [ ] T045 [P] [US1] Implement get_photos Tauri command in src-tauri/src/commands.rs (query photos by album_id)
- [ ] T046 [P] [US1] Implement generate_thumbnail Tauri command in src-tauri/src/commands.rs (on-the-fly generation)

**TDD Green Phase Verification**:
- [ ] T047 [US1] Run backend tests and verify all pass

### Frontend Service Tests for User Story 1 (TDD Red Phase)

- [ ] T048 [P] [US1] Write unit tests for albumService.getAlbums() in tests/unit/services/albumService.test.js
- [ ] T049 [P] [US1] Write unit tests for photoService.getPhotos() in tests/unit/services/photoService.test.js
- [ ] T050 [P] [US1] Write unit tests for photoService.generateThumbnail() in tests/unit/services/photoService.test.js

**TDD Red Phase Verification**:
- [ ] T051 [US1] Verify service tests fail

### Frontend Service Implementation for User Story 1 (TDD Green Phase)

- [ ] T052 [P] [US1] Create albumService.js in src/services/albumService.js with getAlbums() method
- [ ] T053 [P] [US1] Create photoService.js in src/services/photoService.js with getPhotos() and generateThumbnail() methods

**TDD Green Phase Verification**:
- [ ] T054 [US1] Verify service tests pass

### Frontend Component Tests for User Story 1 (TDD Red Phase)

- [ ] T055 [P] [US1] Write unit tests for AlbumGrid component in tests/unit/components/AlbumGrid.test.js
- [ ] T056 [P] [US1] Write unit tests for AlbumCard component in tests/unit/components/AlbumCard.test.js
- [ ] T057 [P] [US1] Write unit tests for PhotoTile component in tests/unit/components/PhotoTile.test.js
- [ ] T058 [US1] Write unit tests for PhotoModal component in tests/unit/components/PhotoModal.test.js

**TDD Red Phase Verification**:
- [ ] T059 [US1] Verify component tests fail

### Frontend Component Implementation for User Story 1 (TDD Green Phase)

- [ ] T060 [P] [US1] Create AlbumGrid component in src/components/AlbumGrid.js (renders album cards, handles sorting)
- [ ] T061 [P] [US1] Create AlbumCard component in src/components/AlbumCard.js (displays album name, date, photo count)
- [ ] T062 [P] [US1] Create PhotoTile component in src/components/PhotoTile.js (renders photo thumbnail in grid)
- [ ] T063 [US1] Create PhotoModal component in src/components/PhotoModal.js (full-size photo viewer with navigation)

**TDD Green Phase Verification**:
- [ ] T064 [US1] Verify component tests pass

### Styling for User Story 1

- [ ] T065 [P] [US1] Create albums.css in src/styles/albums.css (album grid and card styles)
- [ ] T066 [P] [US1] Create photos.css in src/styles/photos.css (photo tile grid and modal styles)

### Integration for User Story 1

- [ ] T067 [US1] Wire up AlbumGrid in main.js to display on app launch
- [ ] T068 [US1] Implement click handler in AlbumCard to navigate to photo view
- [ ] T069 [US1] Implement back navigation from photo view to album grid
- [ ] T070 [US1] Test performance: verify thumbnail generation under 2 seconds for 100 photos
- [ ] T071 [US1] Write integration test in tests/integration/albums.test.js for complete viewing workflow

**Checkpoint**: User Story 1 complete and independently functional

---

## Phase 4: User Story 2 - Create and Organize Albums (Priority: P2)

**Goal**: Users can create new albums with dates and add photos from their device via file picker

**Independent Test**: Click "Create Album", enter name and date, click "Add Photos", select files from picker, verify album appears with photos

### Backend Tests for User Story 2 (TDD Red Phase)

- [ ] T072 [P] [US2] Write unit tests for create_album command in tests/unit/commands/albums.test.js
- [ ] T073 [P] [US2] Write unit tests for open_file_picker command in tests/unit/commands/files.test.js
- [ ] T074 [P] [US2] Write unit tests for validate_image_file command in tests/unit/commands/validation.test.js
- [ ] T075 [US2] Write unit tests for add_photos command in tests/unit/commands/photos.test.js

**User Approval Checkpoint**:
- [ ] T076 [US2] Present backend tests to user for approval

**TDD Red Phase Verification**:
- [ ] T077 [US2] Verify tests fail

### Backend Implementation for User Story 2 (TDD Green Phase)

- [ ] T078 [P] [US2] Implement create_album Tauri command in src-tauri/src/commands.rs (insert into albums table)
- [ ] T079 [P] [US2] Implement open_file_picker Tauri command in src-tauri/src/commands.rs (native file dialog)
- [ ] T080 [P] [US2] Implement validate_image_file Tauri command in src-tauri/src/commands.rs (extension + magic bytes)
- [ ] T081 [US2] Implement add_photos Tauri command in src-tauri/src/commands.rs (batch insert with validation)
- [ ] T082 [US2] Add validation to prevent nested albums (FR-008 compliance)

**TDD Green Phase Verification**:
- [ ] T083 [US2] Verify backend tests pass

### Frontend Service Tests for User Story 2 (TDD Red Phase)

- [ ] T084 [P] [US2] Write unit tests for albumService.createAlbum() in tests/unit/services/albumService.test.js
- [ ] T085 [P] [US2] Write unit tests for photoService.addPhotos() in tests/unit/services/photoService.test.js
- [ ] T086 [US2] Write unit tests for imageValidator in tests/unit/utils/imageValidator.test.js

**TDD Red Phase Verification**:
- [ ] T087 [US2] Verify service tests fail

### Frontend Service Implementation for User Story 2 (TDD Green Phase)

- [ ] T088 [P] [US2] Add createAlbum() method to src/services/albumService.js
- [ ] T089 [P] [US2] Add addPhotos() method to src/services/photoService.js
- [ ] T090 [US2] Create imageValidator.js in src/utils/imageValidator.js (client-side pre-validation)

**TDD Green Phase Verification**:
- [ ] T091 [US2] Verify service tests pass

### Frontend Component Tests for User Story 2 (TDD Red Phase)

- [ ] T092 [P] [US2] Write unit tests for CreateAlbumModal component in tests/unit/components/CreateAlbumModal.test.js
- [ ] T093 [US2] Write unit tests for FilePickerButton component in tests/unit/components/FilePickerButton.test.js

**TDD Red Phase Verification**:
- [ ] T094 [US2] Verify component tests fail

### Frontend Component Implementation for User Story 2 (TDD Green Phase)

- [ ] T095 [P] [US2] Create CreateAlbumModal component in src/components/CreateAlbumModal.js (form with name and date inputs)
- [ ] T096 [US2] Create FilePickerButton component in src/components/FilePickerButton.js (triggers file picker, handles selection)

**TDD Green Phase Verification**:
- [ ] T097 [US2] Verify component tests pass

### Integration for User Story 2

- [ ] T098 [US2] Add "Create Album" button to AlbumGrid component
- [ ] T099 [US2] Wire up CreateAlbumModal to create album and refresh grid
- [ ] T100 [US2] Add "Add Photos" button to photo view in PhotoModal
- [ ] T101 [US2] Implement photo addition workflow with progress feedback
- [ ] T102 [US2] Add error handling for invalid files (show user-friendly messages)
- [ ] T103 [US2] Write integration test in tests/integration/albums.test.js for album creation and photo addition

**Checkpoint**: User Stories 1 AND 2 both work independently

---

## Phase 5: User Story 3 - Reorder Albums via Drag and Drop (Priority: P3)

**Goal**: Users can drag albums to reorder them on main page

### Backend Tests for User Story 3 (TDD Red Phase)

- [ ] T104 [US3] Write unit tests for update_album_order command in tests/unit/commands/albums.test.js

**User Approval Checkpoint**:
- [ ] T105 [US3] Present tests to user for approval

**TDD Red Phase Verification**:
- [ ] T106 [US3] Verify tests fail

### Backend Implementation for User Story 3 (TDD Green Phase)

- [ ] T107 [US3] Implement update_album_order Tauri command in src-tauri/src/commands.rs (batch update display_order)

**TDD Green Phase Verification**:
- [ ] T108 [US3] Verify tests pass

### Frontend Service Tests for User Story 3 (TDD Red Phase)

- [ ] T109 [US3] Write unit tests for albumService.updateAlbumOrder() in tests/unit/services/albumService.test.js

**TDD Red Phase Verification**:
- [ ] T110 [US3] Verify tests fail

### Frontend Service Implementation for User Story 3 (TDD Green Phase)

- [ ] T111 [US3] Add updateAlbumOrder() method to src/services/albumService.js

**TDD Green Phase Verification**:
- [ ] T112 [US3] Verify tests pass

### Frontend Component Tests for User Story 3 (TDD Red Phase)

- [ ] T113 [US3] Write unit tests for DragDropHandler module in tests/unit/components/DragDropHandler.test.js

**TDD Red Phase Verification**:
- [ ] T114 [US3] Verify tests fail

### Frontend Component Implementation for User Story 3 (TDD Green Phase)

- [ ] T115 [US3] Create DragDropHandler module in src/components/DragDropHandler.js (HTML5 drag-and-drop API)
- [ ] T116 [US3] Add drag-and-drop event listeners to AlbumCard component (dragstart, dragover, drop events)

**TDD Green Phase Verification**:
- [ ] T117 [US3] Verify tests pass

### Integration for User Story 3

- [ ] T118 [US3] Integrate DragDropHandler with AlbumGrid to enable reordering
- [ ] T119 [US3] Add visual feedback during drag (ghost element, drop zones)
- [ ] T120 [US3] Implement custom order persistence (update database on drop)
- [ ] T121 [US3] Add keyboard navigation support for accessibility (arrow keys + Enter to reorder)
- [ ] T122 [US3] Test performance: verify drag response under 100ms
- [ ] T123 [US3] Write integration test in tests/integration/albums.test.js for drag-and-drop reordering

**Checkpoint**: User Stories 1-3 complete

---

## Phase 6: User Story 4 - Manage Album Details (Priority: P4)

**Goal**: Users can rename albums, change dates, and delete albums with confirmation

### Backend Tests for User Story 4 (TDD Red Phase)

- [ ] T124 [P] [US4] Write unit tests for update_album command in tests/unit/commands/albums.test.js
- [ ] T125 [US4] Write unit tests for delete_album command in tests/unit/commands/albums.test.js

**User Approval Checkpoint**:
- [ ] T126 [US4] Present tests to user for approval

**TDD Red Phase Verification**:
- [ ] T127 [US4] Verify tests fail

### Backend Implementation for User Story 4 (TDD Green Phase)

- [ ] T128 [P] [US4] Implement update_album Tauri command in src-tauri/src/commands.rs (update name or date)
- [ ] T129 [US4] Implement delete_album Tauri command in src-tauri/src/commands.rs (cascade delete photos)

**TDD Green Phase Verification**:
- [ ] T130 [US4] Verify tests pass

### Frontend Service Tests for User Story 4 (TDD Red Phase)

- [ ] T131 [P] [US4] Write unit tests for albumService.updateAlbum() in tests/unit/services/albumService.test.js
- [ ] T132 [US4] Write unit tests for albumService.deleteAlbum() in tests/unit/services/albumService.test.js

**TDD Red Phase Verification**:
- [ ] T133 [US4] Verify tests fail

### Frontend Service Implementation for User Story 4 (TDD Green Phase)

- [ ] T134 [P] [US4] Add updateAlbum() method to src/services/albumService.js
- [ ] T135 [US4] Add deleteAlbum() method to src/services/albumService.js

**TDD Green Phase Verification**:
- [ ] T136 [US4] Verify tests pass

### Frontend Component Tests for User Story 4 (TDD Red Phase)

- [ ] T137 [P] [US4] Write unit tests for EditAlbumModal component in tests/unit/components/EditAlbumModal.test.js
- [ ] T138 [US4] Write unit tests for ConfirmDeleteDialog component in tests/unit/components/ConfirmDeleteDialog.test.js

**TDD Red Phase Verification**:
- [ ] T139 [US4] Verify tests fail

### Frontend Component Implementation for User Story 4 (TDD Green Phase)

- [ ] T140 [P] [US4] Create EditAlbumModal component in src/components/EditAlbumModal.js (form to rename/change date)
- [ ] T141 [US4] Create ConfirmDeleteDialog component in src/components/ConfirmDeleteDialog.js (confirmation prompt)

**TDD Green Phase Verification**:
- [ ] T142 [US4] Verify tests pass

### Integration for User Story 4

- [ ] T143 [US4] Add context menu or edit button to AlbumCard component
- [ ] T144 [US4] Wire up EditAlbumModal to update album and refresh grid
- [ ] T145 [US4] Implement album repositioning after date change
- [ ] T146 [US4] Add delete option with ConfirmDeleteDialog
- [ ] T147 [US4] Handle cascade deletion feedback (show deleted photo count)
- [ ] T148 [US4] Write integration test in tests/integration/albums.test.js for album management operations

**Checkpoint**: User Stories 1-4 complete

---

## Phase 7: User Story 5 - Manage Photos Within Albums (Priority: P5)

**Goal**: Users can remove individual photos from albums and view photos full-size

### Backend Tests for User Story 5 (TDD Red Phase)

- [ ] T149 [US5] Write unit tests for remove_photo command in tests/unit/commands/photos.test.js

**User Approval Checkpoint**:
- [ ] T150 [US5] Present tests to user for approval

**TDD Red Phase Verification**:
- [ ] T151 [US5] Verify tests fail

### Backend Implementation for User Story 5 (TDD Green Phase)

- [ ] T152 [US5] Implement remove_photo Tauri command in src-tauri/src/commands.rs (delete photo reference)

**TDD Green Phase Verification**:
- [ ] T153 [US5] Verify tests pass

### Frontend Service Tests for User Story 5 (TDD Red Phase)

- [ ] T154 [US5] Write unit tests for photoService.removePhoto() in tests/unit/services/photoService.test.js

**TDD Red Phase Verification**:
- [ ] T155 [US5] Verify tests fail

### Frontend Service Implementation for User Story 5 (TDD Green Phase)

- [ ] T156 [US5] Add removePhoto() method to src/services/photoService.js

**TDD Green Phase Verification**:
- [ ] T157 [US5] Verify tests pass

### Frontend Component Enhancements for User Story 5

- [ ] T158 [US5] Add remove button overlay to PhotoTile component
- [ ] T159 [US5] Enhance PhotoModal with left/right navigation controls
- [ ] T160 [US5] Add keyboard shortcuts to PhotoModal (Esc to close, arrow keys to navigate)

### Integration for User Story 5

- [ ] T161 [US5] Wire up photo removal with confirmation
- [ ] T162 [US5] Implement photo navigation in modal (prev/next)
- [ ] T163 [US5] Handle empty album state (display message)
- [ ] T164 [US5] Test performance: verify full-size photo loads within 1 second
- [ ] T165 [US5] Write integration test in tests/integration/photos.test.js for photo management

**Checkpoint**: All 5 user stories complete

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Production readiness, optimization, and final validation

### Error Handling & UX Polish

- [ ] T166 [P] Add error boundaries and global error handling
- [ ] T167 [P] Implement loading states and spinners for async operations
- [ ] T168 [P] Add empty state messages (no albums, no photos)
- [ ] T169 [P] Implement responsive design adjustments in main.css
- [ ] T170 [P] Add tooltips and help text for UI elements

### Performance Optimization

- [ ] T171 [P] Optimize thumbnail generation performance (parallel processing)
- [ ] T172 [P] Add database query optimization and indexing verification
- [ ] T173 [P] Implement check_orphaned_photos maintenance command in src-tauri/src/commands.rs

### End-to-End Testing

- [ ] T174 Write E2E tests for all user journeys (P1-P5) in tests/e2e/user-journeys.test.js

### Success Criteria Verification (Constitutional Requirement)

**Verify all success criteria with measurable evidence**

- [ ] T175 [P] Verify SC-001: Measure clicks from launch to photo view (target: ≤3 clicks)
- [ ] T176 [P] Verify SC-002: Time trial creating album + adding 10 photos (target: ≤2 minutes)
- [ ] T177 [P] Verify SC-003: Measure drag-and-drop response time (target: <100ms) - Already done in T122
- [ ] T178 [P] Verify SC-004: Count photos visible on 1920x1080 display (target: ≥12 photos)
- [ ] T179 [P] Verify SC-005: Measure drag-and-drop success rate over 20 attempts (target: ≥95%)
- [ ] T180 [P] Verify SC-006: Test all formats (JPEG, PNG, GIF, WebP) successfully added
- [ ] T181 [P] Verify SC-007: Test order persistence across 10 app restarts (target: 100%)
- [ ] T182 [P] Verify SC-008: Measure full-size photo load time (target: <1 second) - Already done in T164
- [ ] T183 [P] Verify SC-009: Measure thumbnail render time for 100 photos (target: <2 seconds) - Already done in T070
- [ ] T184 [P] Verify SC-010: Test invalid file rejection (target: 100% rejected with messages)

### Documentation & Quality

- [ ] T185 [P] Update README.md with project overview and quick start
- [ ] T186 Validate quickstart.md guide (verify 15-minute setup target)
- [ ] T187 [P] Run ESLint and fix all warnings
- [ ] T188 [P] Run Prettier to format all code
- [ ] T189 Security audit: verify file system permissions and validation
- [ ] T190 Performance audit: benchmark all success criteria (SC-001 through SC-010)

---

## Task Count Summary

- **Total Tasks**: 190 (was 100)
- **Phase 1 (Setup)**: 12 tasks (was 10) - Added zero-warning enforcement
- **Phase 2 (Foundational)**: 26 tasks (was 10) - Added contract tests, verification tasks
- **Phase 3 (US1 - View/Browse)**: 33 tasks (was 16) - Restructured for TDD
- **Phase 4 (US2 - Create/Add)**: 32 tasks (was 15) - Restructured for TDD
- **Phase 5 (US3 - Reorder)**: 20 tasks (was 11) - Restructured for TDD
- **Phase 6 (US4 - Manage Albums)**: 25 tasks (was 12) - Restructured for TDD
- **Phase 7 (US5 - Manage Photos)**: 17 tasks (was 9) - Restructured for TDD
- **Phase 8 (Polish)**: 25 tasks (was 17) - Added SC verification

**Constitution Compliance**: ✅ **COMPLETE**
- Tests written BEFORE implementation in all user stories
- User approval checkpoints after test creation
- TDD Red-Green-Refactor cycle enforced
- Contract tests for all Tauri commands
- Database verification tasks
- Zero-warning policy enforced

**Parallel Opportunities**: ~70 tasks marked [P] can run concurrently

**MVP Scope**: ~83 tasks (Phases 1-3) for basic viewing functionality

**Estimated Timeline** (with TDD overhead):
- **MVP** (US1 only): 3 weeks (1 developer)
- **Full Feature Set** (US1-US5): 8-10 weeks (1 developer)
- **Parallel Execution**: 5-6 weeks (3 developers)
