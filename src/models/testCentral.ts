import Project from './project';
import User from './user';

const db = {
    Project,
    User
}

Project.findByPk(1).then(p => {
    p?.setCreator()
})

export default db;

type ObjWithName<Name> = {
    name: Name;
}

function create<T>(obj : ObjWithName<T>[]) : keyof T {
    return {} as keyof T;
}

let a = create([{name: "something"}, {name: "somethingElse"}]);