import SeeTeachers from '../../../components/SeeTeachers';

const ManageTeachers = ({ onSuccess }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm h-full">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900">Manage Teachers</h2>
      </div>
      <div className="p-6 h-full overflow-auto">
        <SeeTeachers
          onClose={() => {}}
          onSuccess={onSuccess}
          inline={true}
        />
      </div>
    </div>
  );
};

export default ManageTeachers;