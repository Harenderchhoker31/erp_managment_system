import AssignClass from '../../../components/AssignClass';

const ManageClasses = ({ onSuccess }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm h-full">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900">Assign Classes</h2>
      </div>
      <div className="p-6 h-full overflow-auto">
        <AssignClass
          onClose={() => {}}
          onSuccess={onSuccess}
          inline={true}
        />
      </div>
    </div>
  );
};

export default ManageClasses;