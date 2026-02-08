# Drag-and-Drop DBT

A visual data flow editor built with [Xyflow](https://xyflow.com/) (React Flow) that produces `dbt-factory` compatible configurations.

## Overview
This project aims to bridge the gap between visual ETL tools (like Alteryx) and the power of dbt. It allows users to build data pipelines by dragging and dropping nodes representing transformations, which are then compiled into a YAML configuration for `dbt-factory`.

## Key Features
- **Visual Node Editor**: Built on Xyflow for high-performance, customizable flowcharts.
- **dbt-factory Integration**: One-click generation of `factory_config.yml`.
- **Alteryx-style Tools**: Pre-defined nodes for Join, Filter, Aggregate, Formula, and more.
- **Live Preview**: See the generated dbt-factory YAML as you build.

## Project Structure
- `/frontend`: React application using Xyflow.
- `/compiler`: Logic to translate the visual graph into `dbt-factory` nodes and dependencies.

## roadmap
- [ ] Initialize React + Xyflow frontend.
- [ ] Define custom node types for dbt-factory templates (Append, Join, Filter, etc.).
- [ ] Implement dependency resolution (Edges to YAML).
- [ ] Export functionality to `factory_config.yml`.
