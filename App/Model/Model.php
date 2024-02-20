<?php
namespace App\Model;

use App\Database\Database;
use App\Objects\ParentObject;

class Model
{
    protected $pdo;
    protected $table;
    protected $query;
    protected $owners = [];
    protected $operators = ['=', '>', '>=', '<', '<=', '<>'];

    public function __construct()
    {
        $NAMESPACE_LENGTH = 10;

        $this->pdo = Database::connect();
        $this->query = new \stdClass;
        $this->table = new \stdClass;

        $this->table->name = strtolower(substr(get_class($this), $NAMESPACE_LENGTH));
        $this->table->columns = $this->getTableColumns();
    }

    protected function buildQueries()
    {
        switch ($this->query->action) {
            case 'select':
                $this->selectQueryBuilder();
                break;

            case 'insert':
                $this->insertQueryBuilder();
                break;

            case 'update':
                $this->updateQueryBuilder();
                break;

            case 'delete':
                $this->deleteQueryBuilder();
                break;

            default:
                break;
        }
    }

    protected function deleteQueryBuilder()
    {
        $query = "DELETE FROM {$this->table->name} ";

        if (isset($this->query->conditions) && !empty($this->query->conditions)) {
            $query .= $this->getConditionsQuery();
        }

        $this->query->string = $query;
    }

    protected function selectQueryBuilder()
    {
        $query = "SELECT ";
        $tableName = $this->table->name;

        $queryColumns = array_map(function ($column) use ($tableName) {
            if (stripos($column, "(") !== false) {
                return $column;
            } else {
                return "{$tableName}.{$column} AS {$column}";
            }
        }, $this->query->columns ?? $this->table->columns);

        $query .= implode(', ', $queryColumns);

        if (isset($this->query->joins) && !empty($this->query->joins)) {
            foreach ($this->query->joins as $joinTableName => $joinTableColumns) {
                $joinTableColumns = array_map(function ($column) use ($joinTableName) {
                    return "{$joinTableName}.{$column} AS {$joinTableName}_external_{$column}";
                }, $joinTableColumns);
                $query .= ' , ' . implode(', ', $joinTableColumns);
            }
        }

        $query .= " FROM {$tableName} ";

        if (isset($this->query->joins) && !empty($this->query->joins)) {
            foreach ($this->query->joins as $joinTableName => $joinTableColumns) {
                if (!empty($this->owners) && array_search($joinTableName, $this->owners) !== false) {
                    $query .= "LEFT JOIN {$joinTableName} ON {$joinTableName}.id = {$tableName}.{$joinTableName}_id ";
                } else {
                    $query .= "LEFT JOIN {$joinTableName} ON {$tableName}.id = {$joinTableName}.{$tableName}_id ";
                }
            }
        }

        if (isset($this->query->conditions) && !empty($this->query->conditions)) {
            $query .= $this->getConditionsQuery();
        }

        if (isset($this->query->orderBy) && !empty($this->query->orderBy)) {
            $key = array_key_first($this->query->orderBy);
            if ($key) {
                $query .= "ORDER BY {$key} {$this->query->orderBy[$key]} ";
            }
        }

        if (isset($_GET['limit']) && is_numeric($_GET['limit'])) {
            $query .= "LIMIT {$_GET['limit']} ";
        }

        if ($this->table->name !== "token" && isset($_GET['offset']) && is_numeric($_GET['offset'])) {
            $query .= "OFFSET {$_GET['offset']} ";
        }

        $this->query->string = $query;
    }

    protected function insertQueryBuilder()
    {
        $query = "INSERT INTO {$this->table->name} ";

        $contentEnd = end($this->query->insertContent);

        if (is_array($contentEnd)) {

            $i = 0;
            $columns = array_keys($contentEnd);

            $query .= '(' . implode(', ', $columns) . ') VALUES ';

            foreach ($this->query->insertContent as $content) {

                $formatedValues = array_map(function ($value) {
                    return "'{$value}'";
                }, $content);

                if ($i > 0) {
                    $query .= ", ";
                }

                $query .= '(' . implode(', ', $formatedValues) . ')';
                $i++;
            }

        } else {
            $columns = array_keys($this->query->insertContent);

            $formatedValues = array_map(function ($value) {
                return "'{$value}' ";
            }, $this->query->insertContent);

            $query .= '(' . implode(', ', $columns) . ') VALUES (' . implode(', ', $formatedValues) . ')';
        }

        $this->query->string = $query;
    }

    protected function updateQueryBuilder()
    {
        $query = "UPDATE {$this->table->name} SET ";
        $i = 0;

        foreach ($this->query->updateContent as $key => $value) {
            $query .= ($i > 0) ? ", " : "";
            $query .= "{$key} = '{$value}' ";
            $i++;
        }

        if (isset($this->query->conditions) && !empty($this->query->conditions)) {
            $query .= $this->getConditionsQuery();
        }

        $this->query->string = $query;
    }

    protected function getConditionsQuery(): string
    {
        $subQuery = "";
        $i = 0;
        foreach ($this->query->conditions as $key => $value) {
            if (count($this->query->conditions) > 1 && $i > 0) {
                $subQuery .= "AND ";
            } else {
                $subQuery .= "WHERE ";
            }

            if (is_array($value)) {
                if (count($value) === 3 && array_search($value[1], $this->operators) !== false) {
                    $subQuery .= "{$this->table->name}.{$value[0]} $value[1] '{$value[2]}' ";
                } else {
                    $j = 0;
                    foreach ($value as $string) {
                        if ($j > 0) {
                            $subQuery .= "OR ";
                        }
                        $subQuery .= "$key = '$string' ";
                        $j++;
                    }
                }
            } else {
                $subQuery .= "{$this->table->name}.{$key} = '{$value}' ";
            }
            $i++;
        }

        return $subQuery;
    }

    protected function getTableColumns(?string $table = null): array
    {
        $tableColumns = [];
        $tableName = $table ?? $this->table->name;
        $sql = "SHOW COLUMNS FROM {$tableName}";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $columns = $stmt->fetchAll();

        if (!empty($columns)) {
            foreach ($columns as $column) {
                $tableColumns[] = $column['Field'];
            }
        }
        return $tableColumns;
    }

    protected function execute(): \PDOStatement
    {
        if (!isset($this->query->string) || !$this->query->string) {
            $this->buildQueries();
        }

        $stmt = $this->pdo->prepare($this->query->string);
        $stmt->execute();

        unset($this->query->string, $this->query->conditions, $this->query->orderBy, $this->query->columns);
        return $stmt;
    }

    protected function belongsTo()
    {
        $tableNames = func_get_args();
        $this->owners = array_merge($this->owners, $tableNames);
    }

    public function delete(?ParentObject $object = null): Model
    {
        if ($object) {
            $this->query->conditions['id'] = $object->get('id');
        }

        $this->query->action = 'delete';
        return $this;
    }

    public function select(): Model
    {
        $args = func_get_args();
        if (!empty($args)) {
            foreach ($args as $column) {
                if (stripos($column, "(") === false) {
                    if (array_search($column, $this->table->columns) === false) {
                        Response()->json([
                            'error' => "column {$column} was not found in table {$this->table->name}"
                        ]);
                    }
                }
            }

            $this->query->columns = $this->sanitize($args);
        } else {
            $this->query->columns = null;
        }

        $this->query->action = 'select';
        return $this;
    }

    public function query(string $query)
    {
        $this->query->string = $query;
        return $this;
    }

    public function with(): Model
    {
        $args = func_get_args();
        $joins = [];

        if (!empty($args)) {
            foreach ($args as $joinTable) {
                $joinTableColumns = $this->getTableColumns($joinTable);
                $joins[$joinTable] = $joinTableColumns;
            }
            $this->query->joins = $joins;
        }
        return $this;
    }

    public function where(array $conditions): Model
    {
        foreach ($conditions as $key => $value) {
            if (is_string($value)) {
                if (array_search($key, $this->table->columns) === false) {
                    Response()->json([
                        'error' => "column {$key} was not found in table {$this->table->name}"
                    ]);
                }
            }
        }

        $this->query->conditions = $this->sanitize($conditions);
        return $this;
    }

    public function orderBy($column, ?string $type = "ASC"): Model
    {
        $this->query->orderBy = [$column => strtoupper($type)];
        return $this;
    }

    /**
     * escapes htmlentities caracters and sanitizes values (string)
     * @param array $array the array to sanitize
     * @return array the sanitized array
     */
    protected function sanitize(array $array): array
    {
        $processedArray = [];
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                foreach ($value as $index => $string) {
                    if (array_search($string, $this->operators) === false && is_string($string)) {
                        $value[$index] = htmlentities($string);
                    }
                }
            } else {
                if (is_string($value)) {
                    $value = htmlentities($value);
                }
            }

            $processedArray[$key] = $value;
        }

        return $processedArray;
    }

    public function array(): Model
    {
        $this->query->toArray = true;
        return $this;
    }

    public function get(): array
    {
        $stmt = $this->execute();
        $results = $stmt->fetchAll();

        if (!empty($results)) {
            $newResults = [];
            foreach ($results as $result) {
                $newResult = $this->formatFetchResult($result);
                $newResults[] = $newResult;
            }
            return $newResults;
        }

        unset($this->query->joins, $this->query->toArray);
        return $results;
    }

    /**
     * gets the first result of a query
     * @return \stdClass|array|bool 
     */
    public function first()
    {
        $stmt = $this->execute();
        $result = $stmt->fetch();

        if ($result) {
            $result = $this->formatFetchResult($result);
        }

        unset($this->query->joins, $this->query->toArray);
        return $result;
    }

    /**
     * Similar to first, but returns the last result instead
     * @return \stdClass|bool 
     */
    public function last()
    {
        $this->orderBy('id', 'DESC');
        return $this->first();
    }

    public function find(int $id)
    {
        $findData = $this->select()
            ->where(['id' => $id])
            ->first();

        return $findData;
    }

    /**
     * formats the result to a more readable and convenient way
     * @return \stdClass|array array if $this->array() was executed, an Stdclass otherwise;
     */
    protected function formatFetchResult($result)
    {
        if (!isset($this->query->toArray) || !$this->query->toArray) {
            $parent = new \stdClass;

            foreach ($result as $key => $value) {
                if (array_search($key, $this->table->columns) !== false || stripos($key, "_external_") === false) {
                    $parent->$key = is_string($result[$key]) ? html_entity_decode($result[$key]) : $result[$key];
                }
            }

            if (isset($this->query->joins) && !empty($this->query->joins)) {
                foreach ($this->query->joins as $joinTable => $column) {
                    $join = new \stdClass;
                    foreach ($result as $key => $value) {
                        $stripos = stripos($key, $joinTable);
                        if ($stripos !== false) {
                            $newKey = substr($key, strlen("{$joinTable}_external_"));
                            if ($newKey) {
                                $join->$newKey = is_string($value) ? html_entity_decode($value) : $value;
                            }
                        }
                    }
                    $parent->$joinTable = $join;
                }
                return $parent;
            }

            return $parent;
        } else {
            $parent = [];
            foreach ($result as $key => $value) {
                if (array_search($key, $this->table->columns) !== false || stripos($key, "_external_") === false) {
                    $parent[$key] = is_string($result[$key]) ? html_entity_decode($result[$key]) : $result[$key];
                }
            }

            if (isset($this->query->joins) && !empty($this->query->joins)) {
                foreach ($this->query->joins as $joinTable => $column) {
                    $join = [];
                    foreach ($result as $key => $value) {
                        $stripos = stripos($key, $joinTable);
                        if ($stripos !== false) {
                            $newKey = substr($key, strlen("{$joinTable}_external_"));
                            if ($newKey) {
                                $join[$newKey] = is_string($value) ? html_entity_decode($value) : $value;
                            }
                        }
                    }
                    $parent[$joinTable] = $join;
                }
                return $parent;
            }
            return $parent;
        }
    }

    public function create(array $array): Model
    {
        $this->query->insertContent = $this->sanitize($array);
        $this->query->action = 'insert';

        return $this;
    }

    public function update(array $array): Model
    {

        foreach ($array as $column => $value) {
            if (array_search($column, $this->table->columns) === false) {
                Response()->json([
                    'error' => "Column {$column} was not found in table {$this->table->name}"
                ]);
            }
        }

        $this->query->updateContent = $this->sanitize($array);
        $this->query->action = 'update';

        return $this;
    }

    /**
     * executes the current query
     * @return \stdClass|bool the last inserted value or the state of the update
     */
    public function save()
    {
        $stmt = $this->execute();

        if ($this->query->action === "insert") {
            return $this
                ->select()
                ->where([
                    'id' => $this->pdo->lastInsertId()
                ])
                ->first();
        }

        unset($this->query->action);
        return boolval($stmt);
    }
}