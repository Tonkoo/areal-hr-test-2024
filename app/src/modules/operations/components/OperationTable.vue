<template>
  <v-table>
      <thead>
        <tr>
          <th>Код</th>
          <th>Сотрудник</th>
          <th>Тип операции</th>
          <th>Отдел</th>
          <th>Должность</th>
          <th>Зарплата</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in operations" :key="item.operations_id">
          <td>{{ item.operations_id }}</td>
          <td>{{ item.full_name }}</td>
          <td>{{ item.type_operation }}</td>
          <td>{{ item.departments_name }}</td>
          <td>{{ item.positions_name }}</td>
          <td>{{ item.salary }}</td>
        </tr>
      </tbody>
    </v-table>
</template>

<script>
export default {
  props: {
    operations: {
      type: Array,
      required: true,
    },
  },
};
</script>