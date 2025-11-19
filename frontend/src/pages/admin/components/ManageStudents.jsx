import SeeStudents from '../../../components/SeeStudents';

const ManageStudents = ({ onSuccess }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm h-full">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900">Manage Students</h2>
      </div>
      <div className="p-6 h-full overflow-auto">
        <SeeStudents
          onClose={() => {}}
          onSuccess={onSuccess}
          inline={true}
        />
      </div>
    </div>
  );
};

export default ManageStudents;